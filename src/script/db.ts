import { Toast } from "./toast";

const APP_SALT = "app-salt";
const DEFAULT_USER_TOKEN = {
	uname: "Guest",
	upass: "user-passphrase-or-token",
};

const REGISTERED_USERS_KEY = "app_registered_users";

type Token = { uname: string; upass: string };

// ----------------------------------------------------------------------------
// MULTI-USER HELPERS
// ----------------------------------------------------------------------------

/**
 * Hashes a string using SHA-256 to produce a clean hex digest string.
 */
async function hashToken(token: string): Promise<string> {
	const msgUint8 = new TextEncoder().encode(token);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// Convert bytes to hex string
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Map of unameHash -> upassHash stored in localStorage */
function getRegisteredUsers(): Record<string, string> {
	try {
		const stored = localStorage.getItem(REGISTERED_USERS_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch {
		return {};
	}
}

async function registerUser(uname: string, upass: string): Promise<void> {
	if (uname === DEFAULT_USER_TOKEN.uname) return;

	const unameHash = await hashToken(uname);
	const upassHash = await hashToken(upass);
	const users = getRegisteredUsers();

	users[unameHash] = upassHash;
	localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

/**
 * Raw key derivation from a password string.
 */
async function deriveRawKey(passphrase: string): Promise<CryptoKey> {
	const enc = new TextEncoder();
	const keyMaterial = await window.crypto.subtle.importKey(
		"raw",
		enc.encode(passphrase),
		"PBKDF2",
		false,
		["deriveKey"],
	);

	return window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: enc.encode(APP_SALT),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"],
	);
}

// ----------------------------------------------------------------------------
// STATE & AUTH MANAGEMENT
// ----------------------------------------------------------------------------

let userName: string | null = null;
let effectiveToken: Token | null = null;
let userKey: CryptoKey | null = null;
let userCacheName: string | null = null;

export function getUserName() {
	return userName || DEFAULT_USER_TOKEN.uname;
}

async function processAuthentication(): Promise<{
	key: CryptoKey;
	cacheName: string;
}> {
	const rawToken = getUrlToken() || DEFAULT_USER_TOKEN;

	if (rawToken.uname === DEFAULT_USER_TOKEN.uname) {
		userName = DEFAULT_USER_TOKEN.uname;
		effectiveToken = DEFAULT_USER_TOKEN;
		const guestKey = await deriveRawKey(DEFAULT_USER_TOKEN.upass);
		const guestCache = `app-cache-guest-${await hashToken(DEFAULT_USER_TOKEN.upass)}`;
		return { key: guestKey, cacheName: guestCache };
	}

	const registeredUsers = getRegisteredUsers();
	const incomingUnameHash = await hashToken(rawToken.uname);
	const incomingUpassHash = await hashToken(rawToken.upass);

	// Create a UNIQUE cache name per user using BOTH username hash and password hash
	const userSpecificCacheName = `app-cache-${incomingUnameHash}-${incomingUpassHash}`;

	const savedUpassHash = registeredUsers[incomingUnameHash];

	// Case 1: Brand new username -> Register user & store password hash
	if (!savedUpassHash) {
		await registerUser(rawToken.uname, rawToken.upass);
		userName = rawToken.uname;
		effectiveToken = rawToken;

		Toast.success(`User "${rawToken.uname}" successfully registered!`);
		console.log(`User "${rawToken.uname}" successfully registered!`);

		const key = await deriveRawKey(rawToken.upass);
		return { key, cacheName: userSpecificCacheName };
	}

	// Case 2: Registered user -> Check password match
	if (savedUpassHash === incomingUpassHash) {
		// Correct Password
		userName = rawToken.uname;
		effectiveToken = rawToken;

		Toast.success(`Welcome back, ${rawToken.uname}!`);
		console.log(`Welcome back, ${rawToken.uname}!`);

		const key = await deriveRawKey(rawToken.upass);
		return { key, cacheName: userSpecificCacheName };
	} else {
		// Wrong Password -> Fallback to Guest
		console.warn(
			`[auth] Wrong upass for known user "${rawToken.uname}". Falling back to guest token.`,
		);

		userName = DEFAULT_USER_TOKEN.uname;
		effectiveToken = DEFAULT_USER_TOKEN;

		Toast.error("Incorrect password! Falling back to guest session.");
		console.error("Incorrect password! Falling back to guest session.");

		const guestKey = await deriveRawKey(DEFAULT_USER_TOKEN.upass);
		const guestCache = `app-cache-guest-${await hashToken(DEFAULT_USER_TOKEN.upass)}`;
		return { key: guestKey, cacheName: guestCache };
	}
}

let authPromise: Promise<{ key: CryptoKey; cacheName: string }> | null = null;

async function ensureAuth() {
	if (!authPromise) {
		authPromise = processAuthentication();
	}
	const result = await authPromise;
	userKey = result.key;
	userCacheName = result.cacheName;
	return result;
}

let urlToken: Token | null = null;
function getUrlToken(): Token | null {
	if (urlToken) return urlToken;

	const url = new URL(window.location.href);
	const uname = url.searchParams.get("uname");
	const upass = url.searchParams.get("upass");

	if (uname && upass) {
		url.searchParams.delete("uname");
		url.searchParams.delete("upass");
		window.history.replaceState(
			{},
			"",
			url.pathname + url.search + url.hash,
		);

		urlToken = { uname, upass };
		return urlToken;
	}
	return null;
}

async function getCacheName(): Promise<string> {
	if (userCacheName) return userCacheName;
	const auth = await ensureAuth();
	return auth.cacheName;
}

async function getUserKey(): Promise<CryptoKey> {
	if (userKey) return userKey;
	const auth = await ensureAuth();
	return auth.key;
}

interface EncryptedPayload {
	iv: number[];
	cipher: number[];
}

async function encryptData<T>(
	data: T,
	key: CryptoKey,
): Promise<EncryptedPayload> {
	const encoded = new TextEncoder().encode(JSON.stringify(data));
	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	const cipherBuffer = await window.crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encoded,
	);

	return {
		iv: Array.from(iv),
		cipher: Array.from(new Uint8Array(cipherBuffer)),
	};
}

async function decryptData<T>(
	payload: EncryptedPayload,
	key: CryptoKey,
): Promise<T> {
	const iv = new Uint8Array(payload.iv);
	const cipher = new Uint8Array(payload.cipher);

	const decryptedBuffer = await window.crypto.subtle.decrypt(
		{ name: "AES-GCM", iv },
		key,
		cipher,
	);

	const decoded = new TextDecoder().decode(decryptedBuffer);
	return JSON.parse(decoded) as T;
}

// ----------------------------------------------------------------------------
// ENCRYPTED DB IMPLEMENTATION
// ----------------------------------------------------------------------------

async function read<T = unknown>(keyName: string): Promise<T | null> {
	try {
		const cacheName = await getCacheName();
		const cryptoKey = await getUserKey();
		const cache = await caches.open(cacheName);
		const response = await cache.match(keyName);
		if (!response) return null;

		const payload = (await response.json()) as EncryptedPayload;
		return await decryptData<T>(payload, cryptoKey);
	} catch (error) {
		console.error(
			`[db.read] Failed to read/decrypt key "${keyName}":`,
			error,
		);
		return null;
	}
}

async function write<T = unknown>(keyName: string, data: T): Promise<boolean> {
	try {
		const cacheName = await getCacheName();
		const cryptoKey = await getUserKey();
		const encryptedPayload = await encryptData(data, cryptoKey);
		const cache = await caches.open(cacheName);
		const response = new Response(JSON.stringify(encryptedPayload), {
			headers: { "Content-Type": "application/json" },
		});
		await cache.put(keyName, response);
		return true;
	} catch (error) {
		console.error(
			`[db.write] Failed to encrypt/write key "${keyName}":`,
			error,
		);
		return false;
	}
}

async function del(keyName: string): Promise<boolean> {
	try {
		const cacheName = await getCacheName();
		const cache = await caches.open(cacheName);
		return await cache.delete(keyName);
	} catch (error) {
		console.error(`[db.delete] Failed to delete key "${keyName}":`, error);
		return false;
	}
}

async function clear(): Promise<boolean> {
	const cacheName = await getCacheName();
	try {
		return await caches.delete(cacheName);
	} catch (error) {
		console.error(`[db.clear] Failed to clear current user cache:`, error);
		return false;
	}
}

export const db = {
	read,
	write,
	delete: del,
	clear,
};

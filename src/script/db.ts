import { Toast } from "./toast";

const DEFAULT_USER_TOKEN = {
	uname: "Guest",
	upass: "guest",
};

const REGISTERED_USERS_KEY = "app_registered_users";

type Token = { uname: string; upass: string };

// Stores user metadata: unameHash -> { salt: string, verifier: string }
interface UserMetadata {
	salt: string;
	verifier: string; // Encrypted string used to verify if upass is correct
}

// ----------------------------------------------------------------------------
// MULTI-USER HELPERS & CRYPTO
// ----------------------------------------------------------------------------

/**
 * Hashes a string using SHA-256 to produce a clean hex digest string.
 */
async function hashToken(token: string): Promise<string> {
	const msgUint8 = new TextEncoder().encode(token);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Get registered users map from localStorage */
function getRegisteredUsers(): Record<string, UserMetadata> {
	try {
		const stored = localStorage.getItem(REGISTERED_USERS_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch {
		return {};
	}
}

function saveRegisteredUsers(users: Record<string, UserMetadata>): void {
	localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

/**
 * Derives an AES-GCM CryptoKey using PBKDF2 with user-specific salt.
 */
async function deriveRawKey(
	passphrase: string,
	saltString: string,
): Promise<CryptoKey> {
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
			salt: enc.encode(saltString),
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
let userKey: CryptoKey | null = null;
let userCacheName: string | null = null;

export function getUserName(): string {
	return userName || DEFAULT_USER_TOKEN.uname;
}

async function processAuthentication(): Promise<{
	key: CryptoKey;
	cacheName: string;
}> {
	const rawToken = getUrlToken() || DEFAULT_USER_TOKEN;

	// Guest Mode
	if (rawToken.uname === DEFAULT_USER_TOKEN.uname) {
		userName = DEFAULT_USER_TOKEN.uname;
		const guestSalt = `salt-${DEFAULT_USER_TOKEN.uname}`;
		const guestKey = await deriveRawKey(
			DEFAULT_USER_TOKEN.upass,
			guestSalt,
		);
		const guestCache = `app-cache-guest`;
		return { key: guestKey, cacheName: guestCache };
	}

	const registeredUsers = getRegisteredUsers();
	const incomingUnameHash = await hashToken(rawToken.uname);
	const userMeta = registeredUsers[incomingUnameHash];
	const userCache = `app-cache-${incomingUnameHash}`;

	// Case 1: Brand new user -> Register user with a unique salt
	if (!userMeta) {
		const userSalt = `salt-${incomingUnameHash}`;
		const key = await deriveRawKey(rawToken.upass, userSalt);

		// Create a verification payload encrypted with the user's derived key
		const verifierPayload = await encryptData("AUTH_VERIFIED", key);

		registeredUsers[incomingUnameHash] = {
			salt: userSalt,
			verifier: JSON.stringify(verifierPayload),
		};
		saveRegisteredUsers(registeredUsers);

		userName = rawToken.uname;
		Toast.success(`User "${rawToken.uname}" successfully registered!`);
		console.log(`User "${rawToken.uname}" successfully registered!`);

		return { key, cacheName: userCache };
	}

	// Case 2: Registered User -> Verify password using stored verifier payload
	try {
		const candidateKey = await deriveRawKey(rawToken.upass, userMeta.salt);
		const verifierPayload = JSON.parse(
			userMeta.verifier,
		) as EncryptedPayload;

		// Attempt decryption test
		const decryptedCheck = await decryptData<string>(
			verifierPayload,
			candidateKey,
		);

		if (decryptedCheck === "AUTH_VERIFIED") {
			userName = rawToken.uname;
			Toast.success(`Welcome back, ${rawToken.uname}!`);
			console.log(`Welcome back, ${rawToken.uname}!`);

			return { key: candidateKey, cacheName: userCache };
		} else {
			throw new Error("Invalid verifier payload");
		}
	} catch {
		// Decryption failed -> Wrong password
		console.warn(`[auth] Incorrect password for "${rawToken.uname}".`);

		userName = DEFAULT_USER_TOKEN.uname;
		Toast.error("Incorrect password! Falling back to guest session.");

		const guestSalt = `salt-${DEFAULT_USER_TOKEN.uname}`;
		const guestKey = await deriveRawKey(
			DEFAULT_USER_TOKEN.upass,
			guestSalt,
		);
		const guestCache = `app-cache-guest`;

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

// ----------------------------------------------------------------------------
// ENCRYPTION & DECRYPTION HELPERS
// ----------------------------------------------------------------------------

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

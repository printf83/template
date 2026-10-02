const APP_SALT = "app-salt";
const DEFAULT_USER_TOKEN = "user-passphrase-or-token";

// ----------------------------------------------------------------------------
// KEY DERIVATION & CRYPTO HELPERS
// ----------------------------------------------------------------------------

/**
 * Derives an AES-GCM CryptoKey from a passphrase using PBKDF2.
 */
async function deriveKey(
	passphrase: string,
	salt: string = APP_SALT,
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
			salt: enc.encode(salt),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"],
	);
}

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

let userCacheName: string | null = null;
async function getCacheName(): Promise<string> {
	if (userCacheName) return userCacheName;

	const token = getUrlToken() || DEFAULT_USER_TOKEN;
	const tokenHash = await hashToken(token);
	userCacheName = `app-cache-${tokenHash}`;

	return userCacheName;
}

function getUrlToken(): string | null {
	const url = new URL(window.location.href);
	const token = url.searchParams.get("uid");

	if (token) {
		// Remove 'uid' parameter from URL without reloading the page
		url.searchParams.delete("uid");
		window.history.replaceState(
			{},
			"",
			url.pathname + url.search + url.hash,
		);
	}

	return token;
}

let userKey: CryptoKey | null = null;
async function getUserKey() {
	if (userKey !== null) return userKey;

	const token = getUrlToken() || DEFAULT_USER_TOKEN;
	userKey = await deriveKey(token);

	return userKey;
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

/**
 * Reads and decrypts JSON data from the browser Cache API.
 */
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

/**
 * Encrypts and writes JSON-serializable data to the browser Cache API.
 */
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

/**
 * Deletes a single item from the specified cache.
 */
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

/**
 * Completely clears and deletes the specified cache store.
 */
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

const DEFAULT_USER_TOKEN = {
	uname: "Guest",
	upass: "guest",
};

const REGISTERED_USERS_KEY = "app_registered_users";
const SESSION_KEY = "app_active_session";

type Token = { uname: string; upass: string };

interface UserMetadata {
	salt: string;
	verifier: string;
}

export type LoginResult =
	| { status: "registered"; uname: string }
	| { status: "welcome"; uname: string }
	| { status: "invalid_password" }
	| { status: "guest" };

interface AuthState {
	userName: string;
	userKey: CryptoKey;
	userCacheName: string;
}

let authState: AuthState | null = null;

// ----------------------------------------------------------------------------
// CRYPTO HELPERS
// ----------------------------------------------------------------------------

async function hashToken(token: string): Promise<string> {
	const msgUint8 = new TextEncoder().encode(token);
	const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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

export interface EncryptedPayload {
	iv: number[];
	cipher: number[];
}

export async function encryptData<T>(
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

export async function decryptData<T>(
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
// SESSION PERSISTENCE
// ----------------------------------------------------------------------------

function saveSession(token: Token): void {
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(token));
}

function clearSession(): void {
	sessionStorage.removeItem(SESSION_KEY);
}

function getSavedSession(): Token | null {
	try {
		const stored = sessionStorage.getItem(SESSION_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch {
		return null;
	}
}

// ----------------------------------------------------------------------------
// AUTH SERVICE API
// ----------------------------------------------------------------------------

export function getUserName(): string {
	return authState?.userName || DEFAULT_USER_TOKEN.uname;
}

export async function getAuthContext(): Promise<{
	key: CryptoKey;
	cacheName: string;
}> {
	if (!authState) {
		const savedSession = getSavedSession();
		if (savedSession) {
			await login(savedSession.uname, savedSession.upass);
		} else {
			await login(DEFAULT_USER_TOKEN.uname, DEFAULT_USER_TOKEN.upass);
		}
	}
	return {
		key: authState!.userKey,
		cacheName: authState!.userCacheName,
	};
}

export async function login(
	uname: string,
	upass: string,
): Promise<LoginResult> {
	const rawToken: Token = { uname, upass };

	// Guest Mode
	if (rawToken.uname === DEFAULT_USER_TOKEN.uname) {
		const guestSalt = `salt-${DEFAULT_USER_TOKEN.uname}`;
		const userKey = await deriveRawKey(DEFAULT_USER_TOKEN.upass, guestSalt);
		const userCacheName = `app-cache-guest`;

		authState = {
			userName: DEFAULT_USER_TOKEN.uname,
			userKey,
			userCacheName,
		};

		clearSession();
		return { status: "guest" };
	}

	const registeredUsers = getRegisteredUsers();
	const incomingUnameHash = await hashToken(rawToken.uname);
	const userMeta = registeredUsers[incomingUnameHash];
	const userCache = `app-cache-${incomingUnameHash}`;

	// Case 1: Register new user
	if (!userMeta) {
		const userSalt = `salt-${incomingUnameHash}`;
		const key = await deriveRawKey(rawToken.upass, userSalt);
		const verifierPayload = await encryptData("AUTH_VERIFIED", key);

		registeredUsers[incomingUnameHash] = {
			salt: userSalt,
			verifier: JSON.stringify(verifierPayload),
		};
		saveRegisteredUsers(registeredUsers);

		authState = {
			userName: rawToken.uname,
			userKey: key,
			userCacheName: userCache,
		};

		saveSession(rawToken);
		return { status: "registered", uname: rawToken.uname };
	}

	// Case 2: Verify existing user
	try {
		const candidateKey = await deriveRawKey(rawToken.upass, userMeta.salt);
		const verifierPayload = JSON.parse(
			userMeta.verifier,
		) as EncryptedPayload;

		const decryptedCheck = await decryptData<string>(
			verifierPayload,
			candidateKey,
		);

		if (decryptedCheck === "AUTH_VERIFIED") {
			authState = {
				userName: rawToken.uname,
				userKey: candidateKey,
				userCacheName: userCache,
			};

			saveSession(rawToken);
			return { status: "welcome", uname: rawToken.uname };
		} else {
			throw new Error("Invalid password");
		}
	} catch {
		return { status: "invalid_password" };
	}
}

export async function logout(): Promise<void> {
	await login(DEFAULT_USER_TOKEN.uname, DEFAULT_USER_TOKEN.upass);
}

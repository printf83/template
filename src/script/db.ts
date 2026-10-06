import {
	getAuthContext,
	encryptData,
	decryptData,
	type EncryptedPayload,
} from "./auth";

const STORE_NAME = "template";
const DB_VERSION = 2;

/** Helper function to open (and initialize) the IndexedDB instance */
function openDB(dbName: string): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function read<T = unknown>(keyName: string): Promise<T | null> {
	try {
		const { cacheName, key } = await getAuthContext();
		const db = await openDB(cacheName);

		const payload = await new Promise<EncryptedPayload | null>(
			(resolve, reject) => {
				const tx = db.transaction(STORE_NAME, "readonly");
				const store = tx.objectStore(STORE_NAME);
				const request = store.get(keyName);

				request.onsuccess = () =>
					resolve((request.result as EncryptedPayload) ?? null);
				request.onerror = () => reject(request.error);
			},
		);

		db.close();

		if (!payload) return null;
		return await decryptData<T>(payload, key);
	} catch (error) {
		console.error(`[db.read] Failed to read key "${keyName}":`, error);
		return null;
	}
}

async function write<T = unknown>(keyName: string, data: T): Promise<boolean> {
	try {
		const { cacheName, key } = await getAuthContext();
		const encryptedPayload = await encryptData(data, key);
		const db = await openDB(cacheName);

		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, "readwrite");
			const store = tx.objectStore(STORE_NAME);
			const request = store.put(encryptedPayload, keyName);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});

		db.close();
		return true;
	} catch (error) {
		console.error(`[db.write] Failed to write key "${keyName}":`, error);
		return false;
	}
}

async function del(keyName: string): Promise<boolean> {
	try {
		const { cacheName } = await getAuthContext();
		const db = await openDB(cacheName);

		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, "readwrite");
			const store = tx.objectStore(STORE_NAME);
			const request = store.delete(keyName);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});

		db.close();
		return true;
	} catch (error) {
		console.error(`[db.delete] Failed to delete key "${keyName}":`, error);
		return false;
	}
}

async function clear(): Promise<boolean> {
	try {
		const { cacheName } = await getAuthContext();

		return await new Promise<boolean>((resolve) => {
			const request = indexedDB.deleteDatabase(cacheName);
			request.onsuccess = () => resolve(true);
			request.onerror = () => resolve(false);
			request.onblocked = () => resolve(true);
		});
	} catch (error) {
		console.error(`[db.clear] Failed to clear database:`, error);
		return false;
	}
}

async function usage() {
	if (navigator.storage && navigator.storage.estimate) {
		const { quota, usage } = await navigator.storage.estimate();

		const usageMB = (usage || 0) / (1024 * 1024);
		const quotaMB = (quota || 0) / (1024 * 1024);

		return { usageMB, quotaMB };
	} else {
		return { usageMB: -1, quotaMB: -1 };
	}
}

export const db = {
	read,
	write,
	delete: del,
	clear,
	usage,
};

export async function clearAllStorage(): Promise<boolean> {
	try {
		await db.clear();
		localStorage.clear();
		sessionStorage.clear();

		return true;
	} catch (error) {
		console.error(
			"[clearAllStorage] Failed to wipe browser storage:",
			error,
		);
		return false;
	}
}

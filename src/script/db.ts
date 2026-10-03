import {
	getAuthContext,
	encryptData,
	decryptData,
} from "./auth";

async function read<T = unknown>(keyName: string): Promise<T | null> {
	try {
		const { cacheName, key } = await getAuthContext();
		const cache = await caches.open(cacheName);
		const response = await cache.match(keyName);
		if (!response) return null;

		const payload = await response.json();
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
		const cache = await caches.open(cacheName);
		const response = new Response(JSON.stringify(encryptedPayload), {
			headers: { "Content-Type": "application/json" },
		});
		await cache.put(keyName, response);
		return true;
	} catch (error) {
		console.error(`[db.write] Failed to write key "${keyName}":`, error);
		return false;
	}
}

async function del(keyName: string): Promise<boolean> {
	try {
		const { cacheName } = await getAuthContext();
		const cache = await caches.open(cacheName);
		return await cache.delete(keyName);
	} catch (error) {
		console.error(`[db.delete] Failed to delete key "${keyName}":`, error);
		return false;
	}
}

async function clear(): Promise<boolean> {
	try {
		const { cacheName } = await getAuthContext();
		return await caches.delete(cacheName);
	} catch (error) {
		console.error(`[db.clear] Failed to clear current cache:`, error);
		return false;
	}
}

export const db = {
	read,
	write,
	delete: del,
	clear,
};

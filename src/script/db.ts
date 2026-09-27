const DEFAULT_CACHE_NAME = "app-cache-v1";

/**
 * Reads and parses JSON data from the browser Cache API.
 */
async function read<T = unknown>(
	key: string,
	cacheName: string = DEFAULT_CACHE_NAME,
): Promise<T | null> {
	try {
		const cache = await caches.open(cacheName);
		const response = await cache.match(key);
		if (!response) return null;
		return (await response.json()) as T;
	} catch (error) {
		console.error(`[db.read] Failed to read key "${key}":`, error);
		return null;
	}
}

/**
 * Writes JSON-serializable data to the browser Cache API.
 */
async function write<T = unknown>(
	key: string,
	data: T,
	cacheName: string = DEFAULT_CACHE_NAME,
): Promise<boolean> {
	try {
		const cache = await caches.open(cacheName);
		const response = new Response(JSON.stringify(data), {
			headers: { "Content-Type": "application/json" },
		});
		await cache.put(key, response);
		return true;
	} catch (error) {
		console.error(`[db.write] Failed to write key "${key}":`, error);
		return false;
	}
}

/**
 * Deletes a single item from the specified cache.
 */
async function del(
	key: string,
	cacheName: string = DEFAULT_CACHE_NAME,
): Promise<boolean> {
	try {
		const cache = await caches.open(cacheName);
		return await cache.delete(key);
	} catch (error) {
		console.error(`[db.delete] Failed to delete key "${key}":`, error);
		return false;
	}
}

/**
 * Completely clears and deletes the specified cache store.
 */
async function clear(cacheName: string = DEFAULT_CACHE_NAME): Promise<boolean> {
	try {
		return await caches.delete(cacheName);
	} catch (error) {
		console.error(
			`[db.clear] Failed to clear cache "${cacheName}":`,
			error,
		);
		return false;
	}
}

export const db = {
	read,
	write,
	delete: del,
	clear,
};

import type { Data, DataWithSchema, SchemaItem } from "../type/data";

// Top-level module state (uses a broad generic bound for runtime storage)
let currentData: Data<readonly SchemaItem[]> | null = null;

/**
 * Returns the active runtime editor state.
 */
export function getCurrentData<
	T extends readonly SchemaItem[] = readonly SchemaItem[],
>(): Data<T> | null {
	return currentData as Data<T> | null;
}

/**
 * Updates the active runtime editor state.
 */
export function setCurrentData<const T extends readonly SchemaItem[]>(
	data: Data<T> | null,
): Data<T> | null {
	currentData = data ? structuredClone(data) : null;
	return currentData as Data<T> | null;
}

/**
 * Identity helper function to enforce strict const generic type inference
 * when defining schema-driven templates in TypeScript.
 */
export function createData<const T extends readonly SchemaItem[]>(
	data: DataWithSchema<T>,
): DataWithSchema<T> {
	return data;
}

import type { Data, DataWithSchema, SchemaItem } from "../type/data";

let currentData: Data<readonly SchemaItem[]> | null = null;

/**
 * Updates the global active data state.
 */
export function setCurrentData<const T extends readonly SchemaItem[]>(
	data: Data<T>,
): void {
	// Re-assign reference directly to avoid runtime TypeError
	currentData = data;
}

/**
 * Retrieves the global active data state.
 */
export function getCurrentData<
	const T extends readonly SchemaItem[],
>(): Data<T> {
	if (!currentData) {
		throw new Error(
			"getCurrentData() was called before initial data was set.",
		);
	}
	return currentData as Data<T>;
}

/**
 * Identity helper function to enforce const generic type inference on SchemaItem arrays.
 */
export function createData<const T extends readonly SchemaItem[]>(
	data: DataWithSchema<T>,
): Data<T> {
	return data;
}

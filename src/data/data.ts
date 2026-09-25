import type { Data, DataWithSchema, SchemaItem } from "../type/data";

/**
 * Identity helper function to enforce const generic type inference on SchemaItem arrays.
 */
export function createData<const T extends readonly SchemaItem[]>(
	data: DataWithSchema<T>,
): Data<T> {
	return data;
}

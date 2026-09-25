import type { Data, SchemaItem } from "../type/data";

export function createData<const T extends readonly SchemaItem[]>(
	data: Data<T>,
): Data<T> {
	return data;
}

import type { Data, SchemaItem } from "../type/data";

export function createData<
	const T extends readonly SchemaItem[],
	const IsJson extends boolean = true,
>(data: Data<T, IsJson>): Data<T, IsJson> {
	return data;
}

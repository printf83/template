type PrimitiveTypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	any: unknown;
};

// Recursive Schema Item with optional `default` fields
export type SchemaItem =
	| {
			[K in keyof PrimitiveTypeMap]: {
				key: string;
				type: K;
				default?: PrimitiveTypeMap[K];
			};
	  }[keyof PrimitiveTypeMap]
	| {
			key: string;
			type: "object";
			children: readonly SchemaItem[];
			default?: Record<string, unknown>;
	  }
	| {
			key: string;
			type: "array";
			items: SchemaItem;
			default?: unknown[];
	  };

// Resolver types
type ResolveType<T extends SchemaItem> = T extends {
	type: "object";
	children: infer C;
}
	? C extends readonly SchemaItem[]
		? SingleRecord<C>
		: Record<string, unknown>
	: T extends { type: "array"; items: infer I }
		? I extends SchemaItem
			? ResolveType<I>[]
			: unknown[]
		: T extends { type: keyof PrimitiveTypeMap }
			? PrimitiveTypeMap[T["type"]]
			: unknown;

// Deeply partial record typing so properties with `default` values in schema can be omitted in `record`
type SingleRecord<T extends readonly SchemaItem[]> = {
	[Item in T[number] as Item["key"]]?: ResolveType<Item>;
};

export type Data<
	T extends readonly SchemaItem[],
	IsJson extends boolean = true,
> = {
	title: string;
	thumb?: string;
	lang: string;
	isJson: IsJson;
	schema: T;
	template: string;
	script?: string;
	style?: string;
	asset?: Record<string, string>;
	short?: Record<string, string>;
	nationality?: {
		citizen: string;
		nonCitizen: string;
	};
	sex?: {
		male: string;
		female: string;
		unknown: string;
	};
	record: IsJson extends true
		? SingleRecord<T>[] | SingleRecord<T>
		: SingleRecord<T>[];
};

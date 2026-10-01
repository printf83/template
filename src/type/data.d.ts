type PrimitiveTypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	any: unknown;
};

// Recursive Schema Item without `default` fields
export type SchemaItem =
	| {
			key: string;
			type: keyof PrimitiveTypeMap;
	  }
	| {
			key: string;
			type: "object";
			children: readonly SchemaItem[];
	  }
	| {
			key: string;
			type: "array";
			items: SchemaItem;
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

// Deeply partial record typing derived from schema items
export type SingleRecord<T extends readonly SchemaItem[]> = {
	[Item in T[number] as Item["key"]]?: ResolveType<Item>;
};

// ============================================================================
// DATA TYPES
// ============================================================================

/**
 * Base template data as serialized on disk or transferred over the network.
 */
export type Data<T extends readonly SchemaItem[]> = {
	title: string;
	thumb?: string;
	lang: string;
	template: string;
	script?: string;
	style?: string;
	asset?: Record<string, string>;
	abbr?: Record<string, string>;
	nationality?: {
		citizen: string;
		nonCitizen: string;
		unknown: string;
	};
	sex?: {
		male: string;
		female: string;
		unknown: string;
	};
	data: SingleRecord<T>[] | SingleRecord<T>;
};

/**
 * Active runtime data used within the engine/editor, bound with schema types.
 */
export type DataWithSchema<T extends readonly SchemaItem[]> = Data<T> & {
	schema: T;
};

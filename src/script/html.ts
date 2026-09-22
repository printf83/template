import type { Data, SchemaItem } from "../type/data.d";

interface HtmlOptions {
	shortDictionary?: Record<string, string>;
	nationalityLabels?: {
		citizen: string;
		nonCitizen: string;
	};
	sexLabels?: {
		male: string;
		female: string;
		unknown: string;
	};
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const NATIONALITY_CONFIG = {
	labels: {
		citizen: "Malaysia",
		nonCitizen: "Bukan Warganegara",
	},
	// Valid Malaysian state/citizen codes for NRIC digits 7 & 8
	malaysianStateCodes: new Set([
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"29",
		"30",
		"31",
		"32",
		"33",
		"34",
		"35",
		"36",
		"37",
		"38",
		"39",
		"40",
		"41",
		"42",
		"43",
		"44",
		"45",
		"46",
		"47",
		"48",
		"49",
		"50",
		"51",
		"52",
		"53",
		"54",
		"55",
		"56",
		"57",
		"58",
		"59",
		"82",
	]),
};

const SEX_CONFIG = {
	labels: {
		male: "Lelaki",
		female: "Perempuan",
		unknown: "Unknown",
	},
};

const MALAY_MONTHS = [
	"Januari",
	"Februari",
	"Mac",
	"April",
	"Mei",
	"Jun",
	"Julai",
	"Ogos",
	"September",
	"Oktober",
	"November",
	"Disember",
];

// ============================================================================
// HELPER FUNCTIONS & FORMATTERS
// ============================================================================

function buildDefaultMap(
	schema: readonly SchemaItem[],
	prefix = "",
): Map<string, unknown> {
	const defaultsMap = new Map<string, unknown>();
	for (const item of schema) {
		const currentPath = prefix ? `${prefix}.${item.key}` : item.key;
		if ("default" in item && item.default !== undefined) {
			defaultsMap.set(currentPath, item.default);
		}
		if (item.type === "object" && item.children) {
			const childDefaults = buildDefaultMap(item.children, currentPath);
			childDefaults.forEach((val, key) => defaultsMap.set(key, val));
		}
	}
	return defaultsMap;
}

/** Converts integer numbers into Malay words */
function numberToMalayWords(num: number): string {
	if (num === 0) return "Kosong";

	const units = [
		"",
		"Satu",
		"Dua",
		"Tiga",
		"Empat",
		"Lima",
		"Enam",
		"Tujuh",
		"Lapan",
		"Sembilan",
	];

	function convertGroup(n: number): string {
		let res = "";
		if (n >= 100) {
			const hundred = Math.floor(n / 100);
			res += `${units[hundred]} Ratus `;
			n %= 100;
		}
		if (n >= 20) {
			const ten = Math.floor(n / 10);
			res += `${units[ten]} Puluh `;
			n %= 10;
		} else if (n >= 11) {
			res += `${units[n - 10]} Belas `;
			n = 0;
		} else if (n === 10) {
			res += "Sepuluh ";
			n = 0;
		}
		if (n > 0) {
			res += `${units[n]} `;
		}
		return res.trim();
	}

	if (num < 1000) return convertGroup(num);

	const thousands = Math.floor(num / 1000);
	const remainder = num % 1000;

	let result = `${convertGroup(thousands)} Ribu`;
	if (remainder > 0) {
		result += ` ${convertGroup(remainder)}`;
	}
	return result.trim();
}

/** Formats money amount into Malay word representation */
function formatMoneyText(val: unknown): string {
	const num = typeof val === "number" ? val : parseFloat(String(val));
	if (isNaN(num)) return String(val ?? "");

	const intPart = Math.floor(Math.abs(num));
	const fracPart = Math.round((Math.abs(num) - intPart) * 100);

	const intWords = numberToMalayWords(intPart);
	if (fracPart > 0) {
		const fracWords = numberToMalayWords(fracPart);
		return `${intWords} dan sen ${fracWords}`;
	}

	return intWords;
}

/** Formats number into Malay word representation */
function formatNumberText(val: unknown): string {
	const num = typeof val === "number" ? val : parseFloat(String(val));
	if (isNaN(num)) return String(val ?? "");

	const intPart = Math.floor(Math.abs(num));
	const fracPart = Math.round((Math.abs(num) - intPart) * 100);

	const intWords = numberToMalayWords(intPart);
	if (fracPart > 0) {
		const fracWords = numberToMalayWords(fracPart);
		return `${intWords} perpuluhan ${fracWords}`;
	}

	return intWords;
}

/** Native Date parsing helper */
function parseDate(val: unknown): Date | null {
	if (!val) return null;
	if (val instanceof Date) return val;
	const d = new Date(String(val));
	return isNaN(d.getTime()) ? null : d;
}

/** Dedicated helper to extract a Date object from an NRIC string (YYMMDD-PB-#### or 12 digits) */
function parseDateNric(val: unknown): Date | null {
	if (!val) return null;
	if (val instanceof Date) return val;

	const str = String(val).trim();
	const cleanDigits = str.replace(/\D/g, "");

	if (cleanDigits.length === 12) {
		const yy = parseInt(cleanDigits.slice(0, 2), 10);
		const mm = parseInt(cleanDigits.slice(2, 4), 10) - 1; // 0-indexed month
		const dd = parseInt(cleanDigits.slice(4, 6), 10);

		// Century detection based on current 2-digit year (e.g., 2026 -> 26)
		const current2DigitYear = new Date().getFullYear() % 100;
		const fullYear = yy > current2DigitYear ? 1900 + yy : 2000 + yy;

		const nricDate = new Date(fullYear, mm, dd);

		// Validate parameter ranges (prevents invalid dates like Month 13 or Day 32)
		if (
			nricDate.getFullYear() === fullYear &&
			nricDate.getMonth() === mm &&
			nricDate.getDate() === dd
		) {
			return nricDate;
		}
	}

	return null;
}

/** Tries standard parseDate first; if null, falls back to parseDateNric */
function parseDateOrNric(val: unknown): Date | null {
	return parseDate(val) ?? parseDateNric(val);
}

/** Resolves built-in helper functions (%fn) */
function executeHelper(
	fnName: string,
	val: unknown,
	options?: HtmlOptions,
): string {
	if (val === undefined || val === null) return "";

	switch (fnName.toLowerCase()) {
		// Date Functions
		case "age": {
			const d = parseDateOrNric(val);
			if (!d) return String(val);
			const today = new Date();
			let age = today.getFullYear() - d.getFullYear();
			const m = today.getMonth() - d.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
			return String(age);
		}
		case "date": {
			const d = parseDateOrNric(val);
			if (!d) return String(val);
			const day = String(d.getDate()).padStart(2, "0");
			const month = String(d.getMonth() + 1).padStart(2, "0");
			return `${day}/${month}/${d.getFullYear()}`;
		}
		case "yyyy": {
			const d = parseDateOrNric(val);
			return d ? String(d.getFullYear()) : String(val);
		}
		case "mmmm": {
			const d = parseDateOrNric(val);
			return d ? MALAY_MONTHS[d.getMonth()] : String(val);
		}
		case "mm": {
			const d = parseDateOrNric(val);
			return d ? String(d.getMonth() + 1).padStart(2, "0") : String(val);
		}
		case "dd": {
			const d = parseDateOrNric(val);
			return d ? String(d.getDate()).padStart(2, "0") : String(val);
		}
		case "time": {
			const d = parseDateOrNric(val);
			if (!d) return String(val);
			let hours = d.getHours();
			const minutes = String(d.getMinutes()).padStart(2, "0");
			const ampm = hours >= 12 ? "pm" : "am";
			hours = hours % 12 || 12;
			return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
		}

		// Numeric & Currency Functions
		case "int": {
			const num = parseFloat(String(val));
			return isNaN(num) ? String(val) : String(Math.floor(num));
		}
		case "frac": {
			const parts = String(val).split(".");
			return parts.length > 1 ? parts[1] : "00";
		}
		case "money": {
			const num = parseFloat(String(val));
			return isNaN(num) ? String(val) : num.toFixed(2);
		}
		case "money_text": {
			return formatMoneyText(val);
		}
		case "number_text": {
			return formatNumberText(val);
		}

		// Strings & Identification
		case "nric": {
			const clean = String(val).replace(/\D/g, "");
			if (clean.length === 12) {
				return `${clean.slice(0, 6)}-${clean.slice(6, 8)}-${clean.slice(8)}`;
			}
			return String(val);
		}
		case "nationality": {
			const labels =
				options?.nationalityLabels || NATIONALITY_CONFIG.labels;

			// 1. Verify that the first 6 digits form a valid date (and has a valid 12-digit structure)
			const isBirthDateValid = parseDateNric(val) !== null;
			if (!isBirthDateValid) {
				return labels.nonCitizen;
			}

			// 2. Extract state code (digits 7 & 8) and check against Malaysian state codes
			const clean = String(val).replace(/\D/g, "");
			const stateCode = clean.slice(6, 8);

			return NATIONALITY_CONFIG.malaysianStateCodes.has(stateCode)
				? labels.citizen
				: labels.nonCitizen;
		}
		case "sex": {
			const labels = options?.sexLabels || SEX_CONFIG.labels;

			// 1. Verify valid NRIC date and structure (12 digits)
			if (!parseDateNric(val)) {
				return labels.unknown;
			}

			// 2. Extract the last digit
			const clean = String(val).replace(/\D/g, "");
			const lastDigit = parseInt(clean.slice(-1), 10);

			// 3. Odd = Male (1, 3, 5, 7, 9), Even = Female (0, 2, 4, 6, 8)
			return lastDigit % 2 !== 0 ? labels.male : labels.female;
		}
		case "short": {
			const str = String(val);
			const dict = options?.shortDictionary;
			if (!dict) return str;

			// Replace whole words based on dictionary lookup
			return str
				.split(" ")
				.map((word) => dict[word] || word)
				.join(" ");
		}
		case "uppercase":
			return String(val).toUpperCase();
		case "lowercase":
			return String(val).toLowerCase();
		case "titlecase":
			return String(val).replace(
				/\w\S*/g,
				(txt) =>
					txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
			);

		// Fallback for unknown functions
		default:
			return String(val);
	}
}

// ============================================================================
// TOKENIZER & AST PARSER
// ============================================================================

interface Token {
	type: "TEXT" | "TAG";
	value: string;
}

interface ASTNode {
	type: "TEXT" | "VAR" | "FUNC" | "SCOPE" | "LOOP" | "IF" | "IFNOT";
	key?: string;
	fnName?: string;
	value?: string;
	children?: ASTNode[];
}

/** Parses template string into unified tokens */
function tokenize(template: string): Token[] {
	const tokens: Token[] = [];
	// Matches either {{ ... }} OR <!--- ... --->
	const tagRegex = /\{\{\s*(.*?)\s*\}\}|<!---\s*(.*?)\s*--->/g;

	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = tagRegex.exec(template)) !== null) {
		if (match.index > lastIndex) {
			tokens.push({
				type: "TEXT",
				value: template.slice(lastIndex, match.index),
			});
		}
		const tagContent = (match[1] || match[2]).trim();
		tokens.push({ type: "TAG", value: tagContent });
		lastIndex = tagRegex.lastIndex;
	}

	if (lastIndex < template.length) {
		tokens.push({ type: "TEXT", value: template.slice(lastIndex) });
	}

	return tokens;
}

/** Builds an Abstract Syntax Tree (AST) with strict closing tag validation */
function buildAST(tokens: Token[]): ASTNode[] {
	const rootNodes: ASTNode[] = [];
	const stack: { node: ASTNode; closeTagTarget: string }[] = [];

	for (const token of tokens) {
		if (token.type === "TEXT") {
			const targetContainer =
				stack.length > 0
					? stack[stack.length - 1].node.children!
					: rootNodes;
			targetContainer.push({ type: "TEXT", value: token.value });
			continue;
		}

		const content = token.value;

		// 1. Closing Tags: /key, /loop key, /if key, /ifnot key
		if (content.startsWith("/")) {
			if (stack.length === 0) {
				throw new Error(`Unexpected closing tag: {{ ${content} }}`);
			}
			const top = stack[stack.length - 1];
			if (top.closeTagTarget !== content) {
				throw new Error(
					`Mismatched closing tag. Expected {{ ${top.closeTagTarget} }} but found {{ ${content} }}`,
				);
			}
			stack.pop();
			continue;
		}

		const targetContainer =
			stack.length > 0
				? stack[stack.length - 1].node.children!
				: rootNodes;

		// 2. Loop Block: #loop key
		if (content.startsWith("#loop ")) {
			const key = content.replace(/^#loop\s+/, "").trim();
			const node: ASTNode = { type: "LOOP", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/loop ${key}` });
		}
		// 3. If Block: #if key
		else if (content.startsWith("#if ")) {
			const key = content.replace(/^#if\s+/, "").trim();
			const node: ASTNode = { type: "IF", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/if ${key}` });
		}
		// 4. IfNot Block: #ifnot key
		else if (content.startsWith("#ifnot ")) {
			const key = content.replace(/^#ifnot\s+/, "").trim();
			const node: ASTNode = { type: "IFNOT", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/ifnot ${key}` });
		}
		// 5. Scope Block: #key
		else if (content.startsWith("#")) {
			const key = content.slice(1).trim();
			const node: ASTNode = { type: "SCOPE", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/${key}` });
		}
		// 6. Function Helper: %fn key
		else if (content.startsWith("%")) {
			const parts = content.slice(1).trim().split(/\s+/);
			const fnName = parts[0];
			const key = parts.slice(1).join(" ");
			targetContainer.push({ type: "FUNC", fnName, key });
		}
		// 7. Standard Variable Placeholder: prop or key[0].prop
		else {
			targetContainer.push({ type: "VAR", key: content });
		}
	}

	if (stack.length > 0) {
		throw new Error(
			`Unclosed tag remaining: {{ ${stack[stack.length - 1].closeTagTarget} }}`,
		);
	}

	return rootNodes;
}

// ============================================================================
// EVALUATOR & CONTEXT RESOLVER
// ============================================================================

/** Traverses dot-path, supporting arrays key[0].prop and scope stacks */
function resolveValue(
	path: string,
	scopeStack: Record<string, unknown>[],
	rootRecord: unknown,
	defaultsMap: Map<string, unknown>,
): unknown {
	// 1. Root-level direct access
	if (path.startsWith("root.")) {
		const realPath = path.slice(5);
		return getByPath(rootRecord, realPath) ?? defaultsMap.get(realPath);
	}

	// 2. Search local scope stack top-down
	for (let i = scopeStack.length - 1; i >= 0; i--) {
		const val = getByPath(scopeStack[i], path);
		if (val !== undefined && val !== null) {
			return val;
		}
	}

	// 3. Fallback to schema default or empty string
	return defaultsMap.get(path);
}

/** Dot-path navigator with array index support (e.g. "items[0].name") */
function getByPath(obj: unknown, path: string): unknown {
	if (obj === null || obj === undefined || typeof obj !== "object")
		return undefined;

	// Normalize array notations: "items[0].name" -> "items.0.name"
	const normalizedPath = path.replace(/\[(\d+)\]/g, ".$1");
	const keys = normalizedPath.split(".");
	let current: unknown = obj;

	for (const k of keys) {
		if (
			current === null ||
			current === undefined ||
			typeof current !== "object"
		) {
			return undefined;
		}
		current = (current as Record<string, unknown>)[k];
	}

	return current;
}

/** Evaluates truthiness for #if and #ifnot blocks */
function isTruthy(val: unknown): boolean {
	if (!val) return false;
	if (Array.isArray(val)) return val.length > 0;
	if (typeof val === "object") return Object.keys(val).length > 0;
	return true;
}

/** Evaluates AST nodes recursively against dataset */
function evaluateAST(
	ast: ASTNode[],
	scopeStack: Record<string, unknown>[],
	rootRecord: unknown,
	defaultsMap: Map<string, unknown>,
	options?: HtmlOptions,
): string {
	let output = "";

	for (const node of ast) {
		switch (node.type) {
			case "TEXT":
				output += node.value;
				break;

			case "VAR": {
				const val = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
					defaultsMap,
				);
				if (val !== undefined && val !== null) {
					output +=
						typeof val === "object"
							? JSON.stringify(val)
							: String(val);
				}
				break;
			}

			case "FUNC": {
				const val = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
					defaultsMap,
				);
				output += executeHelper(node.fnName!, val, options);
				break;
			}

			case "SCOPE": {
				const targetObj = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
					defaultsMap,
				);
				if (
					targetObj &&
					typeof targetObj === "object" &&
					!Array.isArray(targetObj)
				) {
					output += evaluateAST(
						node.children!,
						[...scopeStack, targetObj as Record<string, unknown>],
						rootRecord,
						defaultsMap,
						options,
					);
				}
				break;
			}

			case "LOOP": {
				const list = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
					defaultsMap,
				);
				if (Array.isArray(list)) {
					list.forEach((item, index) => {
						const isObject =
							typeof item === "object" && item !== null;
						const baseObj = isObject
							? (item as Record<string, unknown>)
							: {};

						// Clean loop metadata
						const loopScope: Record<string, unknown> = {
							...baseObj,
							_index: index,
							_row: index + 1,
							_this: item,
						};

						output += evaluateAST(
							node.children!,
							[...scopeStack, loopScope],
							rootRecord,
							defaultsMap,
							options,
						);
					});
				}
				break;
			}

			case "IF": {
				const val = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
					defaultsMap,
				);
				if (isTruthy(val)) {
					output += evaluateAST(
						node.children!,
						scopeStack,
						rootRecord,
						defaultsMap,
						options,
					);
				}
				break;
			}

			case "IFNOT": {
				const val = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
					defaultsMap,
				);
				if (!isTruthy(val)) {
					output += evaluateAST(
						node.children!,
						scopeStack,
						rootRecord,
						defaultsMap,
						options,
					);
				}
				break;
			}
		}
	}

	return output;
}

// ============================================================================
// EXPORTED HTML ENGINE ENTRYPOINT
// ============================================================================

export function html<T extends readonly SchemaItem[], IsJson extends boolean>(
	data: Data<T, IsJson>,
	options?: HtmlOptions,
): string {
	const defaultsMap = buildDefaultMap(data.schema);
	const tokens = tokenize(data.template);
	const ast = buildAST(tokens);

	const renderSingle = (record: unknown) => {
		const rootScope =
			typeof record === "object" && record !== null
				? (record as Record<string, unknown>)
				: {};
		return evaluateAST(ast, [rootScope], record, defaultsMap, options);
	};

	if (Array.isArray(data.record)) {
		return data.record.map((rec) => renderSingle(rec)).join("\n");
	} else {
		return renderSingle(data.record);
	}
}

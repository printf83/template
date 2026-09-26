import type { Data, SchemaItem, SingleRecord } from "../type/data.d";

// ============================================================================
// LOCALE CONFIGURATIONS
// ============================================================================

const STATECODE_CONFIG = new Set([
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
]);

export type SupportedLang = "EN" | "MY";

/** Resolves lang string to a supported key, defaulting to "MY" */
export function getLangKey(lang?: string): SupportedLang {
	const key = lang?.toUpperCase();
	return key === "EN" ? "EN" : "MY";
}

const MONTH_CONFIG = {
	EN: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	MY: [
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
	],
};

const SHORT_MONTH_CONFIG = {
	EN: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"Jul",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	],
	MY: [
		"Jan",
		"Feb",
		"Mac",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Ogs",
		"Sept",
		"Okt",
		"Nov",
		"Dis",
	],
};

export const SEX_CONFIG = {
	EN: {
		male: "Male",
		female: "Female",
		unknown: "Unknown",
	},
	MY: {
		male: "Lelaki",
		female: "Perempuan",
		unknown: "Tidak Diketahui",
	},
};

export const NATIONALITY_CONFIG = {
	EN: {
		citizen: "Malaysian",
		nonCitizen: "Non-Malaysian",
		unknown: "Unknown",
	},
	MY: {
		citizen: "Malaysia",
		nonCitizen: "Bukan Warganegara",
		unknown: "Tidak Diketahui",
	},
};

// ============================================================================
// NUMBER & CURRENCY CONFIGURATION
// ============================================================================

export const NUMBER_CONFIG = {
	EN: {
		zero: "Zero",
		point: "point",
		andCents: "and Cents",
		digits: [
			"Zero",
			"One",
			"Two",
			"Three",
			"Four",
			"Five",
			"Six",
			"Seven",
			"Eight",
			"Nine",
		],
		units: [
			"",
			"One",
			"Two",
			"Three",
			"Four",
			"Five",
			"Six",
			"Seven",
			"Eight",
			"Nine",
		],
		teens: [
			"Ten",
			"Eleven",
			"Twelve",
			"Thirteen",
			"Fourteen",
			"Fifteen",
			"Sixteen",
			"Seventeen",
			"Eighteen",
			"Nineteen",
		],
		tens: [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		],
		hundred: "Hundred",
		thousand: "Thousand",
	},
	MY: {
		zero: "Kosong",
		point: "perpuluhan",
		andCents: "dan Sen",
		digits: [
			"Kosong",
			"Satu",
			"Dua",
			"Tiga",
			"Empat",
			"Lima",
			"Enam",
			"Tujuh",
			"Lapan",
			"Sembilan",
		],
		units: [
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
		],
		tens: [
			"",
			"",
			"Dua Puluh",
			"Tiga Puluh",
			"Empat Puluh",
			"Lima Puluh",
			"Enam Puluh",
			"Tujuh Puluh",
			"Lapan Puluh",
			"Sembilan Puluh",
		],
		hundred: "Ratus",
		puluh: "Puluh",
		belas: "Belas",
		sepuluh: "Sepuluh",
		thousand: "Ribu",
	},
};

const numberToWords = {
	EN: (num: number): string => {
		const cfg = NUMBER_CONFIG.EN;
		if (num === 0) return cfg.zero;

		function convertGroup(n: number): string {
			let res = "";
			if (n >= 100) {
				res += `${cfg.units[Math.floor(n / 100)]} ${cfg.hundred} `;
				n %= 100;
			}
			if (n >= 20) {
				res += `${cfg.tens[Math.floor(n / 10)]} `;
				n %= 10;
			} else if (n >= 10) {
				res += `${cfg.teens[n - 10]} `;
				n = 0;
			}
			if (n > 0) {
				res += `${cfg.units[n]} `;
			}
			return res.trim();
		}

		if (num < 1000) return convertGroup(num);

		const thousands = Math.floor(num / 1000);
		const remainder = num % 1000;

		let result = `${convertGroup(thousands)} ${cfg.thousand}`;
		if (remainder > 0) {
			result += ` ${convertGroup(remainder)}`;
		}
		return result.trim();
	},
	MY: (num: number): string => {
		const cfg = NUMBER_CONFIG.MY;
		if (num === 0) return cfg.zero;

		function convertGroup(n: number): string {
			let res = "";
			if (n >= 100) {
				const hundred = Math.floor(n / 100);
				res += `${cfg.units[hundred]} ${cfg.hundred} `;
				n %= 100;
			}
			if (n >= 20) {
				const ten = Math.floor(n / 10);
				res += `${cfg.units[ten]} ${cfg.puluh} `;
				n %= 10;
			} else if (n >= 11) {
				res += `${cfg.units[n - 10]} ${cfg.belas} `;
				n = 0;
			} else if (n === 10) {
				res += `${cfg.sepuluh} `;
				n = 0;
			}
			if (n > 0) {
				res += `${cfg.units[n]} `;
			}
			return res.trim();
		}

		if (num < 1000) return convertGroup(num);

		const thousands = Math.floor(num / 1000);
		const remainder = num % 1000;

		let result = `${convertGroup(thousands)} ${cfg.thousand}`;
		if (remainder > 0) {
			result += ` ${convertGroup(remainder)}`;
		}
		return result.trim();
	},
};

/** Formats currency to text based on language */
function formatMoneyText(val: unknown, lang: SupportedLang): string {
	const rawStr = String(val ?? "").trim();
	const num = parseFloat(rawStr);
	if (isNaN(num)) return rawStr;

	// Use fixed string formatting to prevent float precision rounding bugs
	const fixedStr = Math.abs(num).toFixed(2);
	const [intStr, fracStr] = fixedStr.split(".");

	const intPart = parseInt(intStr, 10);
	const fracPart = parseInt(fracStr, 10);

	const cfg = NUMBER_CONFIG[lang];
	const intWords = numberToWords[lang](intPart);

	if (fracPart > 0) {
		const fracWords = numberToWords[lang](fracPart);
		return `${intWords} ${cfg.andCents} ${fracWords}`;
	}

	return intWords;
}

/** Formats number to text based on language */
function formatNumberText(val: unknown, langKey: SupportedLang): string {
	const strVal = String(val ?? "").trim();
	const num = parseFloat(strVal);
	if (isNaN(num)) return strVal;

	const cfg = NUMBER_CONFIG[langKey];
	const parts = strVal.split(".");
	const intPart = Math.abs(parseInt(parts[0], 10) || 0);
	const intWords = numberToWords[langKey](intPart);

	// Decimals are pronounced digit-by-digit (e.g. 1.02 -> One point Zero Two)
	if (parts.length > 1 && parts[1].length > 0) {
		const fracWords = parts[1]
			.split("")
			.map((char) => {
				const digit = parseInt(char, 10);
				return isNaN(digit) ? "" : cfg.digits[digit];
			})
			.filter(Boolean)
			.join(" ");

		if (fracWords) {
			return `${intWords} ${cfg.point} ${fracWords}`;
		}
	}

	return intWords;
}

// ============================================================================
// HELPER FUNCTIONS & FORMATTERS
// ============================================================================

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
function executeHelper<T extends readonly SchemaItem[]>(
	fnName: string,
	val: unknown,
	data: Data<T>,
): string {
	if (val === undefined || val === null) return "";

	const lang = getLangKey(data.lang?.toUpperCase());

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
			return d ? MONTH_CONFIG[lang][d.getMonth()] : String(val);
		}
		case "mmm": {
			const d = parseDateOrNric(val);
			return d ? SHORT_MONTH_CONFIG[lang][d.getMonth()] : String(val);
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
			return formatMoneyText(val, lang);
		}
		case "number_text": {
			return formatNumberText(val, lang);
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
			const l = getLangKey(lang);
			const citizenLabel =
				data.nationality?.citizen || NATIONALITY_CONFIG[l].citizen;
			const nonCitizenLabel =
				data.nationality?.nonCitizen ||
				NATIONALITY_CONFIG[l].nonCitizen;

			const clean = String(val ?? "").replace(/\D/g, "");

			// Validate 12-digit length and birth date validity in one step
			if (clean.length !== 12 || !parseDateNric(clean)) {
				return nonCitizenLabel;
			}

			const stateCode = clean.slice(6, 8);
			return STATECODE_CONFIG.has(stateCode)
				? citizenLabel
				: nonCitizenLabel;
		}
		case "sex": {
			const l = getLangKey(lang);
			const maleLabel = data.sex?.male || SEX_CONFIG[l].male;
			const femaleLabel = data.sex?.female || SEX_CONFIG[l].female;
			const unknownLabel = data.sex?.unknown || SEX_CONFIG[l].unknown;

			const clean = String(val ?? "").replace(/\D/g, "");

			// Validate 12-digit length and birth date validity in one step			const clean = String(val ?? "").replace(/\D/g, "");
			if (clean.length !== 12 || !parseDateNric(clean)) {
				return unknownLabel;
			}

			const lastDigit = parseInt(clean.slice(-1), 10);

			// 3. Odd = Male (1, 3, 5, 7, 9), Even = Female (0, 2, 4, 6, 8)
			return lastDigit % 2 !== 0 ? maleLabel : femaleLabel;
		}
		case "short": {
			const str = String(val);
			const dict = data.short;
			if (!dict) return str;

			return str.replace(/\b[A-Za-z0-9_]+\b/g, (word) => {
				// 1. Look up using lowercase key
				const key = word.toLowerCase();
				const replacement = dict[key];

				if (!replacement) return word;

				// 2. ALL UPPERCASE (e.g., "DARIPADA" -> "DPD")
				if (word === word.toUpperCase()) {
					return replacement.toUpperCase();
				}

				// 3. Title Case (e.g., "Daripada" -> "Dpd")
				if (
					word[0] === word[0].toUpperCase() &&
					word.slice(1) === word.slice(1).toLowerCase()
				) {
					return (
						replacement.charAt(0).toUpperCase() +
						replacement.slice(1).toLowerCase()
					);
				}

				// 4. Default / Lowercase (e.g., "daripada" -> "dpd")
				return replacement.toLowerCase();
			});
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

/** Chain-executes multiple helper functions right-to-left */
function executeHelpers<T extends readonly SchemaItem[]>(
	fnNames: string[],
	val: unknown,
	data: Data<T>,
): string {
	// Right-to-left execution: %uppercase %short %money_text amount
	// equals uppercase(short(money_text(amount)))
	return fnNames.reduceRight((currentVal: unknown, fnName) => {
		return executeHelper(fnName, currentVal, data);
	}, val) as string;
}

// ============================================================================
// TOKENIZER & AST PARSER
// ============================================================================

interface Token {
	type: "TEXT" | "TAG";
	value: string;
}

interface ASTNode {
	type: "TEXT" | "VAR" | "FUNC" | "SCOPE" | "LOOP" | "IF" | "IFNOT" | "ASSET";
	key?: string;
	fnName?: string;
	fnNames?: string[];
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

/** AST Builder with #asset single-tag handling */
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

		// 1. Closing Tags
		if (content.startsWith("/")) {
			if (stack.length === 0)
				throw new Error(`Unexpected closing tag: {{ ${content} }}`);
			const top = stack[stack.length - 1];
			if (top.closeTagTarget !== content) {
				throw new Error(
					`Mismatched closing tag: expected {{ ${top.closeTagTarget} }} but found {{ ${content} }}`,
				);
			}
			stack.pop();
			continue;
		}

		const targetContainer =
			stack.length > 0
				? stack[stack.length - 1].node.children!
				: rootNodes;

		// 2. Asset Block: #asset key (Single Tag - No Closing Tag Required)
		if (content.startsWith("#asset ")) {
			const key = content.replace(/^#asset\s+/, "").trim();
			targetContainer.push({ type: "ASSET", key });
		}
		// 3. Loop Block: #loop key
		else if (content.startsWith("#loop ")) {
			const key = content.replace(/^#loop\s+/, "").trim();
			const node: ASTNode = { type: "LOOP", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/loop ${key}` });
		}
		// 4. If Block: #if key
		else if (content.startsWith("#if ")) {
			const key = content.replace(/^#if\s+/, "").trim();
			const node: ASTNode = { type: "IF", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/if ${key}` });
		}
		// 5. IfNot Block: #ifnot key
		else if (content.startsWith("#ifnot ")) {
			const key = content.replace(/^#ifnot\s+/, "").trim();
			const node: ASTNode = { type: "IFNOT", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/ifnot ${key}` });
		}
		// 6. Scope Block: #key
		else if (content.startsWith("#")) {
			const key = content.slice(1).trim();
			const node: ASTNode = { type: "SCOPE", key, children: [] };
			targetContainer.push(node);
			stack.push({ node, closeTagTarget: `/${key}` });
		}
		// 7. Function Helper: %fn key
		else if (content.startsWith("%")) {
			const parts = content.trim().split(/\s+/);
			const fnNames: string[] = [];
			const keyParts: string[] = [];

			for (const part of parts) {
				if (part.startsWith("%")) {
					fnNames.push(part.slice(1));
				} else {
					keyParts.push(part);
				}
			}

			targetContainer.push({
				type: "FUNC",
				fnNames,
				key: keyParts.join(" "),
			});
		}
		// 8. Standard Variable Placeholder
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
): unknown {
	// 1. Root-level direct access
	if (path.startsWith("root.")) {
		const realPath = path.slice(5);
		return getByPath(rootRecord, realPath) ?? "";
	}

	// 2. Search local scope stack top-down
	for (let i = scopeStack.length - 1; i >= 0; i--) {
		const val = getByPath(scopeStack[i], path);
		if (val !== undefined && val !== null) {
			return val;
		}
	}

	// 3. Fallback to empty string
	return "";
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
function evaluateAST<T extends readonly SchemaItem[]>(
	ast: ASTNode[],
	scopeStack: Record<string, unknown>[],
	rootRecord: unknown,
	data: Data<T>,
): string {
	let output = "";

	for (const node of ast) {
		switch (node.type) {
			case "TEXT":
				output += node.value;
				break;

			case "ASSET": {
				output += data.asset ? (data.asset[node.key!] ?? "") : "";
				break;
			}

			case "VAR": {
				const val = resolveValue(node.key!, scopeStack, rootRecord);
				if (val !== undefined && val !== null) {
					output +=
						typeof val === "object"
							? JSON.stringify(val)
							: String(val);
				}
				break;
			}

			case "FUNC": {
				const val = resolveValue(node.key!, scopeStack, rootRecord);
				output += executeHelpers(node.fnNames!, val, data);
				break;
			}

			case "SCOPE": {
				const targetObj = resolveValue(
					node.key!,
					scopeStack,
					rootRecord,
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
						data,
					);
				}
				break;
			}

			case "LOOP": {
				const list = resolveValue(node.key!, scopeStack, rootRecord);
				if (Array.isArray(list)) {
					list.forEach((item, index) => {
						const isObject =
							typeof item === "object" && item !== null;
						const baseObj = isObject
							? (item as Record<string, unknown>)
							: {};

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
							data,
						);
					});
				}
				break;
			}

			case "IF": {
				const val = resolveValue(node.key!, scopeStack, rootRecord);
				if (isTruthy(val)) {
					output += evaluateAST(
						node.children!,
						scopeStack,
						rootRecord,
						data,
					);
				}
				break;
			}

			case "IFNOT": {
				const val = resolveValue(node.key!, scopeStack, rootRecord);
				if (!isTruthy(val)) {
					output += evaluateAST(
						node.children!,
						scopeStack,
						rootRecord,
						data,
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

export function html<T extends readonly SchemaItem[]>(data: Data<T>): string {
	const tokens = tokenize(data.template);
	const ast = buildAST(tokens);

	const renderSingle = <T extends readonly SchemaItem[]>(
		d: SingleRecord<T>,
	) => {
		const rootScope =
			typeof d === "object" && d !== null
				? (d as Record<string, unknown>)
				: {};
		return evaluateAST(ast, [rootScope], d, data);
	};

	if (Array.isArray(data.data)) {
		return data.data.map((rec) => renderSingle(rec)).join("\n");
	} else {
		return renderSingle(data.data);
	}
}

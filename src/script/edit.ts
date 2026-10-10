import { getLangKey, NATIONALITY_CONFIG, SEX_CONFIG } from "../page/html";
import type { Data, SchemaItem } from "../type/data";
import { getAssetData, setAssetData } from "./asset";
import { createCodeEditor, type EditorLanguage } from "./editor";
import { getAbbrData, setAbbrData } from "./abbr";
import { getElementById } from "./utils";
import { isDarkModeActive } from "./dark";
import { Modal } from "./modal";

type CodeEditor = ReturnType<typeof createCodeEditor>;

type EditorKey = "data" | "html" | "style" | "script" | "asset";

const editorState: Partial<Record<EditorKey, CodeEditor>> = {};

let globalObserver: MutationObserver | null = null;
let globalMediaQuery: MediaQueryList | null = null;
let globalThemeHandler: ((e: MediaQueryListEvent) => void) | null = null;

function formatJson(val: unknown): string {
	if (val === undefined || val === null) return "{}";
	return typeof val === "string" ? val : JSON.stringify(val, null, 2);
}

let activeLangHandler: (() => void) | null = null;

export function initEditor() {
	// 1. Destroy existing editor instances
	Object.keys(editorState).forEach((key) => {
		const k = key as EditorKey;
		if (editorState[k]) {
			editorState[k]!.destroy();
			delete editorState[k];
		}
	});

	// 2. Clean up existing observers/listeners
	if (globalObserver) globalObserver.disconnect();
	if (globalMediaQuery && globalThemeHandler) {
		globalMediaQuery.removeEventListener("change", globalThemeHandler);
	}

	// 3. Setup fresh listeners
	globalMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	globalThemeHandler = () => {
		const isDark = isDarkModeActive();
		Object.values(editorState).forEach((editor) =>
			editor?.setTheme(isDark),
		);
	};
	globalMediaQuery.addEventListener("change", globalThemeHandler);

	globalObserver = new MutationObserver(() => {
		const isDark = isDarkModeActive();
		Object.values(editorState).forEach((editor) =>
			editor?.setTheme(isDark),
		);
	});

	globalObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	// Explicitly type language as EditorLanguage
	const configs: { key: EditorKey; id: string; language: EditorLanguage }[] =
		[
			{ key: "data", id: "data-editor", language: "json" },
			{ key: "html", id: "html-editor", language: "html" },
			{ key: "style", id: "style-editor", language: "css" },
			{ key: "script", id: "script-editor", language: "javascript" },
			{ key: "asset", id: "asset-value", language: "json" },
		];

	const isDark = isDarkModeActive();

	configs.forEach(({ key, id, language }) => {
		const container = getElementById<HTMLDivElement>(id);
		if (container) {
			editorState[key] = createCodeEditor({
				container,
				language,
				isDark,
			});
		}
	});

	// Set nationality placeholder base on lang
	function setPlaceholderBaseOnLang() {
		const lang = getValue("lang-editor");
		if (lang) {
			const langKey = getLangKey(lang);

			setPlaceholder(
				"nationality-citizen-editor",
				NATIONALITY_CONFIG[langKey].citizen,
			);
			setPlaceholder(
				"nationality-noncitizen-editor",
				NATIONALITY_CONFIG[langKey].nonCitizen,
			);
			setPlaceholder(
				"nationality-unknown-editor",
				NATIONALITY_CONFIG[langKey].unknown,
			);
			setPlaceholder("sex-male-editor", SEX_CONFIG[langKey].male);
			setPlaceholder("sex-female-editor", SEX_CONFIG[langKey].female);
			setPlaceholder("sex-unknown-editor", SEX_CONFIG[langKey].unknown);
		}
	}

	const langEditor = getElementById<HTMLSelectElement>("lang-editor");
	if (langEditor) {
		if (activeLangHandler) {
			langEditor.removeEventListener("change", activeLangHandler);
		}

		activeLangHandler = () => setPlaceholderBaseOnLang();
		langEditor.addEventListener("change", activeLangHandler);
		setPlaceholderBaseOnLang();
	}
}

function setValue<
	T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
>(id: string, value?: string) {
	const elem = getElementById<T>(id);
	if (elem) {
		elem.value = value || "";
	}
}

function setPlaceholder<T extends HTMLInputElement | HTMLTextAreaElement>(
	id: string,
	value?: string,
) {
	const elem = getElementById<T>(id);
	if (elem) {
		elem.placeholder = value || "";
	}
}

function setCodeEditorMetadata(
	id: string,
	data: { filename: string; filetype: string },
) {
	const elem = getElementById<HTMLDivElement>(id);
	if (elem) {
		const formLabel = elem.previousElementSibling as HTMLDivElement;

		if (formLabel) {
			formLabel.setAttribute("data-filename", data.filename);
			formLabel.setAttribute("data-filetype", data.filetype);
		}
	}
}

function getValue<
	T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
>(id: string): string | undefined {
	const elem = getElementById<T>(id);
	return elem ? elem.value : undefined;
}

/**
 * Tries to parse JSON text.
 * Returns the parsed object/array if valid, or null if invalid.
 */
export function tryParseJSON(raw: string): any | null {
	if (!raw || !raw.trim()) return null;

	try {
		const parsed = JSON.parse(raw.trim());
		// Require object or array (ignore plain primitives like numbers or booleans)
		if (typeof parsed === "object" && parsed !== null) {
			return parsed;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Tries to parse CSV text into an array of objects using the header row for keys.
 * Returns Record<string, string>[] if valid, or null if invalid.
 */
export function tryParseCSV(raw: string): Record<string, string>[] | null {
	if (!raw || !raw.trim()) return null;

	const lines = raw
		.trim()
		.split(/\r?\n/)
		.filter((line) => line.trim().length > 0);

	// Must have at least 2 lines (1 header + at least 1 data row)
	if (lines.length < 2) return null;

	// Auto-detect delimiter from the header
	const headerLine = lines[0];
	const delimiter =
		[",", ";", "\t"].find((d) => headerLine.includes(d)) || ",";

	// Robust character scanner that respects quoted strings
	const parseRow = (line: string): string[] => {
		const values: string[] = [];
		let current = "";
		let inQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];

			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === delimiter && !inQuotes) {
				values.push(current.trim().replace(/^"|"$/g, "")); // Strip outer quotes
				current = "";
			} else {
				current += char;
			}
		}
		values.push(current.trim().replace(/^"|"$/g, ""));
		return values;
	};

	const headers = parseRow(headerLine);

	// Must have at least 2 columns in the header
	if (headers.length < 2 || headers.some((h) => !h)) return null;

	const result: Record<string, string>[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = parseRow(lines[i]);

		// Fail validation if row column count does not match header column count
		if (values.length !== headers.length) {
			return null;
		}

		const rowObj: Record<string, string> = {};
		headers.forEach((header, idx) => {
			rowObj[header] = values[idx] ?? "";
		});

		result.push(rowObj);
	}

	return result;
}

/**
 * Smartly parses string content as JSON first, falling back to CSV.
 * Displays a Modal alert if both formats fail validation.
 */
export async function parseDataContent(
	raw: string | undefined,
): Promise<any | null> {
	if (!raw || !raw.trim()) {
		await Modal.alert("The provided content is empty.", "Invalid Data");
		return null;
	}

	const trimmed = raw.trim();

	// 1. Attempt JSON parse
	const jsonData = tryParseJSON(trimmed);
	if (jsonData !== null) {
		return jsonData;
	}

	// 2. Attempt CSV parse
	const csvData = tryParseCSV(trimmed);
	if (csvData !== null) {
		return csvData;
	}

	// 3. Fallback: Both formats failed
	await Modal.alert(
		"The content could not be parsed. Please ensure it is valid <b>JSON</b> or <b>CSV</b> with a header row.",
		"Unsupported Data Format",
	);

	return null;
}

/**
 * Escapes a single value according to RFC 4180 CSV specifications.
 */
function escapeCsvField(val: unknown): string {
	if (val === null || val === undefined) return "";

	const str = typeof val === "object" ? JSON.stringify(val) : String(val);

	// Wrap in quotes if value contains commas, quotes, or newlines
	if (/[",\r\n]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

/**
 * Detects whether data should be rendered as JSON or CSV in the editor.
 * - Handles raw strings (attempts JSON parse).
 * - Handles JS objects/arrays (checks for nested objects that require JSON).
 */
export function detectIsJson(
	val: Record<string, unknown> | Record<string, unknown>[],
): boolean {
	// 1. Single plain object -> must be JSON
	if (!Array.isArray(val)) {
		return true;
	}

	// 2. Empty array -> default to JSON
	if (val.length === 0) {
		return true;
	}

	const firstItem = val[0];
	if (
		!firstItem ||
		typeof firstItem !== "object" ||
		Array.isArray(firstItem)
	) {
		return true;
	}

	// 3. Get reference key set from the first item
	const firstKeys = Object.keys(firstItem);
	if (firstKeys.length === 0) {
		return true;
	}

	const referenceKeysSignature = firstKeys.slice().sort().join(",");

	// 4. Verify every object in the array:
	//    a) Has the exact same set of properties
	//    b) DOES NOT contain nested objects or arrays (which CSV cannot flatten)
	const isFlatCsvCompatible = val.every((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) {
			return false;
		}

		const keys = Object.keys(item);
		if (keys.length !== firstKeys.length) {
			return false;
		}

		// Key signature mismatch -> not CSV
		if (keys.sort().join(",") !== referenceKeysSignature) {
			return false;
		}

		// Check if ANY property value is a nested Object or Array
		const hasNestedStructures = Object.values(item).some(
			(v) => v !== null && typeof v === "object",
		);

		// Fail CSV compatibility if nested structures are present
		return !hasNestedStructures;
	});

	// If it is flat & CSV compatible, return false (isJson = false -> CSV)
	// Otherwise return true (isJson = true -> JSON)
	return !isFlatCsvCompatible;
}

/**
 * Converts an array of objects or raw string to a formatted CSV string.
 */
export function formatCSV(data: unknown): string {
	// If it's already a CSV string, return as-is
	if (typeof data === "string") {
		return data;
	}

	if (!Array.isArray(data) || data.length === 0) {
		return "";
	}

	// 1. Extract all unique key names across all objects for headers
	const headers = Array.from(
		new Set(
			data.flatMap((row) =>
				row && typeof row === "object" ? Object.keys(row) : [],
			),
		),
	);

	if (headers.length === 0) return "";

	// 2. Build header row
	const headerRow = headers.map(escapeCsvField).join(",");

	// 3. Build data rows
	const dataRows = data.map((row) => {
		if (!row || typeof row !== "object") return "";
		return headers
			.map((header) =>
				escapeCsvField((row as Record<string, any>)[header]),
			)
			.join(",");
	});

	return [headerRow, ...dataRows].join("\n");
}

/** Populates all initialized editors with data */
export function setEditData<T extends readonly SchemaItem[]>(
	data: Data<T> | null,
) {
	if (!data) return;

	// Raw Text Editors
	editorState.html?.setValue(data.template ?? "");
	editorState.style?.setValue(data.style ?? "");
	editorState.script?.setValue(data.script ?? "");

	// JSON Editors
	editorState.asset?.setValue(formatJson(data.asset ?? {}));

	if ("asset" in data) {
		const assetList = getElementById<HTMLDivElement>("assetList");
		if (assetList) {
			setAssetData(
				assetList,
				(data as any).asset as Record<string, string>,
			);
		}
	}

	if ("abbr" in data) {
		const abbrList = getElementById<HTMLDivElement>("abbrList");
		if (abbrList) {
			setAbbrData(abbrList, (data as any).abbr as Record<string, string>);
		}
	}

	// Data Editor
	const isJson = detectIsJson(data.data);
	if (isJson) {
		setCodeEditorMetadata("data-editor", {
			filename: "data",
			filetype: ".json",
		});
		editorState.data?.setLanguage("json");
		editorState.data?.setValue(formatJson(data.data));
	} else {
		setCodeEditorMetadata("data-editor", {
			filename: "data",
			filetype: ".csv",
		});

		editorState.data?.setLanguage("csv");
		editorState.data?.setValue(formatCSV(data.data));
	}

	// Thumbnail
	const elem = getElementById<HTMLDivElement>("thumb-prev-editor");
	if (elem) {
		elem.style =
			`background-image:url("${data.thumb}");${!data.thumb?.startsWith("data:image/svg") ? "background-size:cover;" : ""}` ||
			"";
	}

	// Input Fields
	setValue("title-editor", data.title);
	setValue("thumb-editor", data.thumb);
	setValue("lang-editor", data.lang);
	setValue("nationality-citizen-editor", data.nationality?.citizen);
	setValue("nationality-noncitizen-editor", data.nationality?.nonCitizen);
	setValue("nationality-unknown-editor", data.nationality?.unknown);
	setValue("sex-male-editor", data.sex?.male);
	setValue("sex-female-editor", data.sex?.female);
	setValue("sex-unknown-editor", data.sex?.unknown);
}

export async function getEditData<
	T extends readonly SchemaItem[],
>(): Promise<Data<T> | null> {
	const dataValue = editorState.data?.getValue();

	const abbrList = getElementById<HTMLDivElement>("abbrList");
	const assetList = getElementById<HTMLDivElement>("assetList");

	// 1. Attempt parsing (parseDataContent triggers Modal.alert on failure)
	const parsedData = await parseDataContent(dataValue);

	// 2. Abort if data parsing failed
	if (dataValue && parsedData === null) {
		return null;
	}

	// 3. Extract lists safety checks
	const abbr = abbrList ? getAbbrData(abbrList) : {};
	const asset = assetList ? getAssetData(assetList) : {};

	return {
		title: getValue("title-editor"),
		thumb: getValue("thumb-editor"),
		lang: getValue("lang-editor"),
		nationality: {
			citizen: getValue("nationality-citizen-editor"),
			nonCitizen: getValue("nationality-noncitizen-editor"),
			unknown: getValue("nationality-unknown-editor"),
		},
		sex: {
			male: getValue("sex-male-editor"),
			female: getValue("sex-female-editor"),
			unknown: getValue("sex-unknown-editor"),
		},
		// Raw text fields
		template: editorState.html?.getValue() ?? "",
		style: editorState.style?.getValue() ?? "",
		script: editorState.script?.getValue() ?? "",

		// Key-Value dictionary fields
		abbr,
		asset,

		// Parsed data store
		data: parsedData ?? [],
	} as Data<T>;
}

export async function validateDuplicate(): Promise<boolean> {
	// 1. Query all marked duplicate items across assets and abbreviations
	const assetDuplicates = document.querySelectorAll<HTMLElement>(
		".asset-list-item.is-duplicate",
	).length;

	const abbrDuplicates = document.querySelectorAll<HTMLElement>(
		".abbr-list-item.is-duplicate",
	).length;

	const totalDuplicates = assetDuplicates + abbrDuplicates;

	// 2. If no duplicates are found, validation passes immediately
	if (totalDuplicates === 0) {
		return true;
	}

	// 3. Build a clear warning message detailing where duplicates exist
	const parts: string[] = [];
	if (assetDuplicates > 0) {
		parts.push(
			`<b>${assetDuplicates}</b> duplicate ${assetDuplicates === 1 ? "asset" : "assets"}`,
		);
	}
	if (abbrDuplicates > 0) {
		parts.push(
			`<b>${abbrDuplicates}</b> duplicate ${abbrDuplicates === 1 ? "abbreviation" : "abbreviations"}`,
		);
	}

	const duplicateText = parts.join(" and ");
	const message = `Found ${duplicateText}. The duplicate keys will overwrite earlier entries upon saving. Do you still want to proceed?`;

	// 4. Prompt user for confirmation
	const confirmed = await Modal.confirm(
		message,
		"Duplicate Entries Detected",
		"warning",
	);

	return confirmed;
}

/**
 * Validates if a string is valid JSON object/array.
 */
export function validateJSON(raw: string): boolean {
	return tryParseJSON(raw) !== null;
}

/**
 * Validates if a string is valid CSV with a header row and matching column counts.
 */
export function validateCSV(raw: string): boolean {
	return tryParseCSV(raw) !== null;
}

export { editorState };

import type { Data, SchemaItem } from "../type/data";
import { getUserName } from "./auth";
import { db } from "./db";

/** Dynamically mounts hidden input[type="file"], prompts user, and cleans up */
export function selectFile(accept: string): Promise<File | null> {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = accept;
		input.style.display = "none";
		document.body.appendChild(input);

		const cleanup = () => {
			if (document.body.contains(input)) {
				input.remove();
			}
		};

		input.addEventListener(
			"change",
			() => {
				const file = input.files?.[0] ?? null;
				cleanup();
				resolve(file);
			},
			{ once: true },
		);

		input.addEventListener(
			"cancel",
			() => {
				cleanup();
				resolve(null);
			},
			{ once: true },
		);

		input.click();
	});
}

// Dynamic load icon
export async function initIcons() {
	const { renderIcons } = await import("../script/icon");
	renderIcons();
}

/**
 * Replaces {{key}} or {{{no escape key}}} placeholders in a template string with matching values from a data object.
 */
export function renderTemplate(
	template: string,
	data: Record<string, unknown> = {},
): string {
	// 1. Process {{{raw}}} placeholders (no escaping)
	let result = template.replace(/\{\{\{\s*(\w+)\s*\}\}\}/g, (_, key) => {
		const val = data[key];
		return val !== undefined && val !== null ? String(val) : "";
	});

	// 2. Process {{escaped}} placeholders (escapes double quotes)
	result = result.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
		const val = data[key];
		if (val === undefined || val === null) return "";
		return String(val).replace(/"/g, "&quot;");
	});

	return result;
}

export function escapeSymbol(value?: string) {
	if (!value) return "";

	return value.replace(
		/[^a-zA-Z0-9\s]/g,
		(char) => `&#${char.codePointAt(0)};`,
	);
}

export function trimAll(value?: string) {
	if (!value) return "";

	return value.trim().replace(/\s+/g, " ");
}

export type ValueType =
	| "json"
	| "javascript"
	| "css"
	| "html"
	| "image"
	| "csv"
	| "text";

export function getFileMetadata(value: string = ""): {
	fileExt: string;
	fileMime: string;
} {
	let fileExt = "txt";
	let fileMime = "text/plain";

	const lang = detectValueType(value);
	switch (lang) {
		case "html":
			fileExt = "html";
			fileMime = "text/html";
			break;
		case "css":
			fileExt = "css";
			fileMime = "text/css";
			break;
		case "javascript":
			fileExt = "js";
			fileMime = "text/javascript";
			break;
		case "json":
			fileExt = "json";
			fileMime = "application/json";
			break;
		case "csv":
			fileExt = "csv";
			fileMime = "text/csv";
			break;
		case "image":
			// Extract image MIME and sub-type from Base64 string (e.g., "data:image/png;base64,...")
			const match = value.match(
				/^data:(image\/([a-zA-Z0-9+.-]+));base64,/i,
			);

			if (match) {
				fileMime = match[1]; // e.g. "image/png" or "image/svg+xml"
				const subType = match[2].toLowerCase(); // e.g. "png", "jpeg", "svg+xml"

				// Normalize extension mapping
				if (subType === "jpeg") {
					fileExt = "jpg";
				} else if (subType === "svg+xml") {
					fileExt = "svg";
				} else {
					fileExt = `${subType}`; // .png, .webp, .gif, .bmp
				}
			} else {
				fileExt = "png";
				fileMime = "image/png";
			}
			break;

		case "text":
		default:
			fileExt = "txt";
			fileMime = "text/plain";
			break;
	}

	return { fileExt, fileMime };
}

export function detectValueType(value?: string): ValueType {
	if (!value || typeof value !== "string") {
		return "text";
	}

	const trimmed = value.trim();
	if (!trimmed) return "text";

	// 1. Image Base64 Data URL
	if (/^data:image\/[a-zA-Z+.-]+;base64,/i.test(trimmed)) {
		return "image";
	}

	// 2. JSON (Must start/end with brackets and parse successfully)
	if (
		(trimmed.startsWith("{") && trimmed.endsWith("}")) ||
		(trimmed.startsWith("[") && trimmed.endsWith("]"))
	) {
		try {
			JSON.parse(trimmed);
			return "json";
		} catch {
			// Invalid JSON, fall through to other checks
		}
	}

	// 3. HTML (Contains DOCTYPE or HTML tag structure)
	if (
		/^\s*<!DOCTYPE\s+html/i.test(trimmed) ||
		/<[a-z][\s\S]*>/i.test(trimmed)
	) {
		return "html";
	}

	// 4. CSS (Matches selector/at-rule with property: value block)
	if (
		/^\s*(@[a-z-]+|[a-z0-9_.\-#*:\s,>+~\[\]="']+)\s*\{[\s\S]*:[^;]+;?[\s\S]*\}/i.test(
			trimmed,
		)
	) {
		return "css";
	}

	// 5. JavaScript (Contains key JS declaration keywords or syntax constructs)
	const jsPatterns = [
		/\b(const|let|var|function|return|import|export|class|async|await)\b/,
		/=>\s*[\{\(]|\bconsole\.(log|error|warn)\b/,
		/document\.(querySelector|getElementById|addEventListener)/,
		/window\.[a-zA-Z_$]/,
	];
	if (jsPatterns.some((pattern) => pattern.test(trimmed))) {
		return "javascript";
	}

	// 6. CSV (At least 2 lines with consistent comma/semicolon delimiter count)
	const lines = trimmed
		.split(/\r?\n/)
		.filter((line) => line.trim().length > 0);
	if (lines.length >= 2) {
		const delimiter = trimmed.includes(";") ? ";" : ",";
		const expectedCols = lines[0].split(delimiter).length;

		if (
			expectedCols > 1 &&
			lines.every((line) => line.split(delimiter).length === expectedCols)
		) {
			return "csv";
		}
	}

	// 7. Default Fallback
	return "text";
}

// Dynamic load default data
export async function initData() {
	const cacheData = await db.read<Data<SchemaItem[]>>("current-data");

	const IS_UNDER_DEVELOPMENT =
		getUserName() === "Guest" && import.meta.env.DEV;
	if (!IS_UNDER_DEVELOPMENT && cacheData) return cacheData;

	const { data } = await import("../data/template_csv");
	return data;
}

export const getElementById = <T extends HTMLElement = HTMLElement>(
	id: string,
): T => {
	return document.getElementById(id) as T;
};

/** Formats numbers with localized thousands separators (e.g. 1,000 or 1.000 based on browser locale) */
export function formatNumber(num: number): string {
	return new Intl.NumberFormat().format(num);
}

/** Formats seconds into human-readable duration (e.g. "1 minute 5 seconds" or "45 seconds") */
export function formatDuration(totalSeconds: number): string {
	const ms = Math.round(totalSeconds * 1000);

	// Show in milliseconds if less than 1 second (1000 ms)
	if (ms < 1000) {
		return `${ms} ms`;
	}

	const seconds = Math.round(totalSeconds);
	if (seconds < 60) {
		return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
	}

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	const minText = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
	if (remainingSeconds === 0) return minText;

	const secText = `${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`;
	return `${minText} ${secText}`;
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Recursively sorts object keys and normalizes empty/undefined fields for comparison.
 */
export function normalizeData(obj: any): any {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(normalizeData).filter((v) => v !== undefined);
	}

	const sortedObj: Record<string, any> = {};
	const keys = Object.keys(obj).sort();

	for (const key of keys) {
		const val = normalizeData(obj[key]);

		// Check if the processed value is "empty" (null, undefined, empty string, or empty object/array)
		const isEmptyObject =
			typeof val === "object" &&
			val !== null &&
			!Array.isArray(val) &&
			Object.keys(val).length === 0;
		const isEmptyArray = Array.isArray(val) && val.length === 0;

		// Skip adding the key if its value is effectively empty
		if (
			val !== undefined &&
			val !== null &&
			val !== "" &&
			!isEmptyObject &&
			!isEmptyArray
		) {
			sortedObj[key] = val;
		}
	}

	return sortedObj;
}

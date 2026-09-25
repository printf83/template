import type { Data, SchemaItem } from "../type/data";
import { setEditData } from "./edit";
import { Modal } from "./modal";
import { selectFile } from "./utils";

export interface UploadFileResult<T extends readonly SchemaItem[]> {
	fileName: string;
	fileType: string;
	content: Data<T>;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

function isObject(val: unknown): val is Record<string, unknown> {
	return typeof val === "object" && val !== null && !Array.isArray(val);
}

function isStringRecord(val: unknown): boolean {
	if (!isObject(val)) return false;
	return Object.values(val).every((item) => typeof item === "string");
}

/**
 * Validates whether an unkown object matches the Data<T> shape (ignoring schema).
 */
export function isValidDataPayload<T extends readonly SchemaItem[]>(
	obj: unknown,
): obj is Data<T> {
	if (!isObject(obj)) return false;

	// 1. Required string fields
	if (typeof obj.title !== "string") return false;
	if (typeof obj.lang !== "string") return false;
	if (typeof obj.template !== "string") return false;

	// 2. Required data field (must be Object or Array)
	if (
		obj.data === null ||
		obj.data === undefined ||
		typeof obj.data !== "object"
	) {
		return false;
	}

	// 3. Optional primitive string fields
	if (obj.thumb !== undefined && typeof obj.thumb !== "string") return false;
	if (obj.script !== undefined && typeof obj.script !== "string")
		return false;
	if (obj.style !== undefined && typeof obj.style !== "string") return false;

	// 4. Optional dictionary fields (Record<string, string>)
	if (obj.asset !== undefined && !isStringRecord(obj.asset)) return false;
	if (obj.short !== undefined && !isStringRecord(obj.short)) return false;

	// 5. Optional nationality configuration
	if (obj.nationality !== undefined) {
		if (!isObject(obj.nationality)) return false;
		const { citizen, nonCitizen, unknown } = obj.nationality;
		if (citizen !== undefined && typeof citizen !== "string") return false;
		if (nonCitizen !== undefined && typeof nonCitizen !== "string")
			return false;
		if (unknown !== undefined && typeof unknown !== "string") return false;
	}

	// 6. Optional sex configuration
	if (obj.sex !== undefined) {
		if (!isObject(obj.sex)) return false;
		const { male, female, unknown } = obj.sex;
		if (male !== undefined && typeof male !== "string") return false;
		if (female !== undefined && typeof female !== "string") return false;
		if (unknown !== undefined && typeof unknown !== "string") return false;
	}

	// Schema field is intentionally ignored
	return true;
}

/**
 * Prompts the user to select a JSON file, parses its content,
 * and returns the typed Data<T> configuration object.
 */
export async function uploadData<
	T extends readonly SchemaItem[],
>(): Promise<UploadFileResult<T> | null> {
	const file = await selectFile(".json,application/json");
	if (!file) return null;

	// 1. Enforce file size limit to avoid tab freeze
	if (file.size > MAX_FILE_SIZE_BYTES) {
		throw new Error(
			`File size exceeds limit (${(MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0)}MB)`,
		);
	}

	// 2. File type / extension pre-validation
	const isJsonExt = file.name.toLowerCase().endsWith(".json");
	const isJsonMime = file.type === "application/json" || file.type === "";

	if (!isJsonExt && !isJsonMime) {
		throw new Error("Invalid file type. Please upload a .json file.");
	}

	try {
		// 3. Read and parse JSON content
		const rawText = await file.text();
		const parsed = JSON.parse(rawText);

		// 4. Structural validation check
		if (!isValidDataPayload<T>(parsed)) {
			throw new Error(
				"Invalid file structure. Required fields (title, lang, template, data) are missing or improperly formatted.",
			);
		}

		// 4. Optionally strip 'schema' key if present
		if ("schema" in parsed) {
			delete (parsed as Record<string, unknown>).schema;
		}

		return {
			fileName: file.name,
			fileType: file.type,
			content: parsed as Data<T>,
		};
	} catch (error) {
		throw error;
	}
}
export function attachUploadFile(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			const result = await uploadData();

			// User cancelled file selection dialog -> exit silently
			if (!result) return;

			// Set editor data
			setEditData(result.content);

			// Success
			await Modal.alert(
				`Successfully load <strong>${result.fileName}</strong> into editor.`,
				"Success",
				"circle-check",
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			await Modal.alert(
				`Failed to process file: ${message}`,
				"Load Failed",
				"triangle-alert",
			);
		}
	});
}

import type { Data, SchemaItem } from "../type/data";
import { setEditData } from "./edit";

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
>(): Promise<Data<T> | null> {
	return new Promise((resolve, reject) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json,application/json";
		input.style.display = "none";
		document.body.appendChild(input);

		const cleanup = () => {
			if (document.body.contains(input)) {
				input.remove();
			}
		};

		input.addEventListener(
			"change",
			async () => {
				const file = input.files?.[0];
				if (!file) {
					cleanup();
					resolve(null);
					return;
				}

				// 1. File type / extension pre-validation
				const isJsonExt = file.name.toLowerCase().endsWith(".json");
				const isJsonMime =
					file.type === "application/json" || file.type === "";

				if (!isJsonExt && !isJsonMime) {
					cleanup();
					reject(
						new Error(
							"Invalid file type. Please upload a .json file.",
						),
					);
					return;
				}

				try {
					// 2. Read and parse JSON content
					const rawText = await file.text();
					const parsed = JSON.parse(rawText);

					// 3. Structural validation check
					if (!isValidDataPayload<T>(parsed)) {
						throw new Error(
							"Invalid file structure. Required fields (title, lang, template, data) are missing or improperly formatted.",
						);
					}

					// 4. Optionally strip 'schema' key if present
					if ("schema" in parsed) {
						delete (parsed as Record<string, unknown>).schema;
					}

					cleanup();
					resolve(parsed);
				} catch (error) {
					cleanup();
					if (error instanceof SyntaxError) {
						reject(
							new Error(
								"Malformed JSON file. Failed to parse text.",
							),
						);
					} else {
						reject(error);
					}
				}
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
export function attachUploadFile(btn: HTMLButtonElement) {
	if (btn) {
		btn.addEventListener("click", async () => {
			try {
				const loadedData = await uploadData();
				if (!loadedData) return; // User cancelled file selection
				setEditData(loadedData);
			} catch (error) {
				console.error(error);
			}
		});
	}
}

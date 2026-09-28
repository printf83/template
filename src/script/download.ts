import type { Data, SchemaItem } from "../type/data";
import { getEditData } from "./edit";

/**
 * Sanitizes a string so it can be safely used as a system filename.
 */
function sanitizeFilename(name: string): string {
	return name.replace(/[/\\?%*:|"<>]/g, "_").trim();
}

/**
 * Exports and downloads a Data<T> configuration object as a formatted JSON file.
 *
 * @param data The Data<T> object to export
 * @param customFilename Optional filename override (defaults to data.title or 'template-data.json')
 */
function downloadData<T extends readonly SchemaItem[]>(
	data: Data<T>,
	customFilename?: string,
): void {
	// 1. Serialize data to pretty-printed JSON
	const jsonText = JSON.stringify(data, null, 2);

	// 2. Create JSON Blob and Object URL
	const blob = new Blob([jsonText], {
		type: "application/json;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);

	// 3. Determine safe filename
	const fallbackName = data.title
		? `${data.title}.json`
		: "template-data.json";
	let filename = sanitizeFilename(customFilename || fallbackName);

	if (!filename.endsWith(".json")) {
		filename += ".json";
	}

	// 4. Create hidden download link & trigger click
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.style.display = "none";

	document.body.appendChild(link);
	link.click();

	// 5. Clean up DOM and revoke Blob URL from memory
	setTimeout(() => {
		if (document.body.contains(link)) {
			link.remove();
		}
		URL.revokeObjectURL(url);
	}, 100);
}

export function attachDownloadFile(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", () => {
		const data = getEditData();
		if (data) {
			downloadData(data, data.title);
		}
	});
}

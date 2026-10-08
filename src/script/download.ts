import type { Data, SchemaItem } from "../type/data";
import { getEditData, validateEditData } from "./edit";

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

	// 3. Determine safe filename
	const fallbackName = data.title
		? `${data.title}.json`
		: "template-data.json";
	let filename = sanitizeFilename(customFilename || fallbackName);

	if (!filename.endsWith(".json")) {
		filename += ".json";
	}

	downloadFile(jsonText, "application/json;charset=utf-8", filename);
}

export function base64ToBlob(
	base64Data: string,
	fallbackType = "image/png",
): Blob {
	let cleanBase64 = base64Data;
	let mimeType = fallbackType;

	// Handle Data URLs (e.g., "data:image/png;base64,iVBORw0KG...")
	if (base64Data.startsWith("data:")) {
		const parts = base64Data.split(",");
		const match = parts[0].match(/:(.*?);/);
		if (match) {
			mimeType = match[1];
		}
		cleanBase64 = parts[1] || "";
	}

	// Decode base64 ASCII string into binary
	const byteCharacters = atob(cleanBase64);
	const byteNumbers = new Uint8Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	return new Blob([byteNumbers], { type: mimeType });
}

export function downloadFile(content: string, type: string, filename: string) {
	let blob: Blob;

	if (content.startsWith("data:") || type.startsWith("image/")) {
		blob = base64ToBlob(content, type);
	} else {
		blob = new Blob([content], { type });
	}

	const url = URL.createObjectURL(blob);
	const fn = sanitizeFilename(filename || "data");

	const link = document.createElement("a");
	link.href = url;
	link.download = fn;
	link.style.display = "none";

	try {
		document.body.appendChild(link);
		link.click();
	} finally {
		setTimeout(() => {
			if (document.body.contains(link)) {
				link.remove();
			}
			URL.revokeObjectURL(url);
		}, 100);
	}
}

export function attachDownloadFile(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const confirmed = await validateEditData();
		if (!confirmed) return;

		const data = getEditData();

		if (data) {
			downloadData(data, data.title || "template");
		}
	});
}

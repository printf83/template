import { Modal } from "./modal";
import { selectFile } from "./utils";

export interface PickedFileResult {
	fileName: string;
	fileType: string;
	content: string; // Base64 for images, text for code/data
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

/** Helper to detect images even if file.type is empty */
function isImageFile(file: File): boolean {
	if (file.type.startsWith("image/")) return true;
	return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(file.name);
}

/** Converts image file to Base64 (Data URL) */
function readAsBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (err) => reject(err);
		reader.readAsDataURL(file);
	});
}

/**
 * Async file picker that reads file content (Base64 for images, plain text for code/data),
 * copies it directly to the clipboard, and returns the metadata.
 */
export async function pickAndCopyFile(): Promise<PickedFileResult | null> {
	const file = await selectFile(".html,.htm,.csv,.json,.css,.js,image/*");
	if (!file) return null;

	// 1. Enforce file size limit to avoid tab freeze
	if (file.size > MAX_FILE_SIZE_BYTES) {
		throw new Error(
			`File size exceeds limit (${(MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0)}MB)`,
		);
	}

	const isImage = isImageFile(file);

	// 2. Read content safely
	const content = isImage ? await readAsBase64(file) : await file.text();

	// 3. Non-blocking clipboard copy with fallback
	let copiedSuccessfully = false;
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(content);
			copiedSuccessfully = true;
		}
	} catch (err) {
		// Fallback if Clipboard API throws due to lost document focus
		console.warn("Clipboard API Failed.", err);
	}

	if (!copiedSuccessfully) {
		try {
			const textArea = document.createElement("textarea");
			textArea.value = content;
			textArea.style.position = "fixed";
			textArea.style.left = "-9999px";
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			textArea.remove();
		} catch (err) {
			console.error("Failed to copy content to clipboard:", err);
			throw new Error("Failed to copy content to clipboard.");
		}
	}

	return {
		fileName: file.name,
		fileType: file.type || (isImage ? "image" : "text/plain"),
		content,
	};
}

export function attachCopyFile(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			const result = await pickAndCopyFile();

			// User cancelled file selection dialog -> exit silently
			if (!result) return;

			await Modal.alert(
				`Successfully copied <strong>${result.fileName}</strong> to your clipboard.`,
				"Success",
				"success",
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			await Modal.alert(
				`Failed to process file: ${message}`,
				"Copy Failed",
				"error",
			);
		}
	});
}

import { Modal } from "./modal";
import { Toast } from "./toast";
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
 * Waits until the browser document has active OS focus.
 * Prevents Chromium from silently suppressing OS-level clipboard broadcast.
 */
async function ensureDocumentFocused(): Promise<void> {
	if (document.hasFocus()) return;

	return new Promise((resolve) => {
		const handleFocus = () => {
			window.removeEventListener("focus", handleFocus);
			// Small tick to let OS surface focus register fully
			setTimeout(resolve, 50);
		};

		window.addEventListener("focus", handleFocus);
		window.focus();

		// Fallback timeout if tab is already focused
		setTimeout(resolve, 300);
	});
}

/**
 * Copies text directly to system clipboard with focus recovery.
 */
async function copyTextToSystemClipboard(text: string): Promise<boolean> {
	// 1. Force document focus so OS clipboard receives the payload
	await ensureDocumentFocused();

	// 2. Try Clipboard API
	if (navigator.clipboard && window.isSecureContext) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (err) {
			console.warn(
				"Async Clipboard write failed, falling back to DOM exec:",
				err,
			);
		}
	}

	// 3. Fallback using visible, focused textarea
	try {
		const textArea = document.createElement("textarea");
		textArea.value = text;

		// Style must allow focus without causing layout jumps
		textArea.style.position = "fixed";
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.width = "2px";
		textArea.style.height = "2px";
		textArea.style.opacity = "0.01";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		const successful = document.execCommand("copy");
		textArea.remove();
		return successful;
	} catch (err) {
		console.error("DOM copy fallback failed:", err);
		return false;
	}
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

	// Copy content with explicit focus restoration
	const success = await copyTextToSystemClipboard(content);
	if (!success) {
		throw new Error("Clipboard write was blocked by the browser.");
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

			Toast.success(
				`Successfully copied <strong>${result.fileName}</strong> to your clipboard.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Modal.alert(
				`Failed to process file: ${message}`,
				"Copy Failed",
				"error",
			);
		}
	});
}

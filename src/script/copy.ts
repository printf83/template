import { Modal } from "./modal";
import { Toast } from "./toast";
import { MAX_FILE_SIZE_BYTES, selectFile } from "./utils";

export interface PickedFileResult {
	fileName: string;
	fileType: string;
	extention: string;
	content: string; // Base64 for images, text for code/data
}

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
export async function copyTextToSystemClipboard(
	text: string,
): Promise<boolean> {
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
 * Reads text directly from the system clipboard.
 * MUST invoke navigator.clipboard.readText() synchronously within the user gesture event loop.
 */
export async function readTextFromSystemClipboard(): Promise<string | null> {
	if (!navigator.clipboard || !window.isSecureContext) {
		console.warn("Clipboard API is not available or context is insecure.");
		return null;
	}

	try {
		// Call readText() IMMEDIATELY.
		// Do not await permission queries or focus helpers before this line!
		return await navigator.clipboard.readText();
	} catch (err) {
		console.warn("Async Clipboard read failed or permission denied:", err);
		return null;
	}
}

/**
 * Async file picker that reads file content (Base64 for images, plain text for code/data),
 * copies it directly to the clipboard, and returns the metadata.
 */
export async function pickFile(
	fileFormat = ".html,.htm,.csv,.json,.css,.txt,.js,image/*",
): Promise<PickedFileResult | null> {
	const file = await selectFile(fileFormat);
	if (!file) return null;

	// 1. Warning file size limit to avoid tab freeze
	if (file.size > MAX_FILE_SIZE_BYTES) {
		const fileSizeMb = (file.size / 1024 / 1024).toFixed(1);
		const limitMb = (MAX_FILE_SIZE_BYTES / 1024 / 1024).toFixed(0);

		const confirmed = await Modal.show({
			type: "warning",
			title: "Large File",
			body: `<p class="pb-4">The selected file is <strong>${fileSizeMb} MB</strong>, which exceeds the recommended <strong>${limitMb} MB</strong> limit. Processing large files may temporarily freeze your browser tab.<br><br>Do you want to proceed?</p>`,
			confirmText: "Yes, proceed",
			cancelText: "Cancel",
		});

		if (!confirmed) return null;
	}

	// 2. Parse file name and extension safely
	const lastDotIndex = file.name.lastIndexOf(".");
	const hasExtension = lastDotIndex > 0;

	const fileNameWithoutExt = hasExtension
		? file.name.substring(0, lastDotIndex)
		: file.name;

	const extension = hasExtension
		? file.name.substring(lastDotIndex + 1).toLowerCase()
		: "";

	const isImage = isImageFile(file);

	// 3. Read content safely
	const content = isImage ? await readAsBase64(file) : await file.text();

	return {
		fileName: fileNameWithoutExt, // Base name without extension
		fileType: file.type || (isImage ? "image" : "text/plain"),
		extention: extension, // Extracted extension (e.g. "json")
		content,
	};
}

export function attachCopyFile(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			const fileContent = await pickFile();

			// User cancelled file selection dialog -> exit silently
			if (!fileContent) return;

			// Copy content with explicit focus restoration
			const copySuccess = await copyTextToSystemClipboard(
				fileContent.content,
			);
			if (!copySuccess) {
				throw new Error("Clipboard write was blocked by the browser.");
			}

			Toast.success(
				`Successfully copied <strong>${fileContent.fileName}</strong> to your clipboard.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to process file: ${message}`);
		}
	});
}

export function attachUploadThumb(
	target: HTMLDivElement,
	input: HTMLInputElement,
) {
	if (!target || !input) return;

	target.addEventListener("click", async () => {
		try {
			const fileContent = await pickFile("image/*");

			// User cancelled file selection dialog -> exit silently
			if (!fileContent) return;

			input.value = fileContent.content;
			target.style =
				`background-image:url("${fileContent.content}");${!fileContent.content.startsWith("data:image/svg") ? "background-size:cover;" : ""}` ||
				"";
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to process file: ${message}`);
		}
	});
}

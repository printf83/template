import { Modal } from "./modal";
import { Toast } from "./toast";
import {
	base64SvgToSvg,
	formatFileSize,
	MAX_FILE_SIZE_BYTES,
	renderTemplate,
	selectFile,
	setButtonLoading,
} from "./utils";
import imgResize from "../html/img-resize.html?raw";

import { db } from "./db";

export interface PickedFileResult {
	fileName: string;
	fileType: string;
	extention: string;
	content: string; // Base64 for images, text for code/data
}

/**
 * Waits until the browser document has active OS focus.
 * Prevents Chromium from silently suppressing OS-level clipboard broadcast.
 */
async function ensureDocumentFocused(): Promise<void> {
	if (document.hasFocus()) return;

	return new Promise((resolve) => {
		let timeoutId: number;

		const cleanup = () => {
			window.removeEventListener("focus", handleFocus);
			clearTimeout(timeoutId);
		};

		const handleFocus = () => {
			cleanup();
			setTimeout(resolve, 50);
		};

		window.addEventListener("focus", handleFocus);
		window.focus();

		timeoutId = window.setTimeout(() => {
			cleanup();
			resolve();
		}, 300);
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

/** Resizes and compresses an image file using a Canvas */
function resizeAndCompressImage(
	file: File,
	maxWidth: number | null,
	quality: number | null,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				let width = img.width;
				let height = img.height;

				// Scale down dimensions only if the image is wider than maxWidth
				if (maxWidth && width > maxWidth) {
					height = Math.round((height * maxWidth) / width);
					width = maxWidth;
				}

				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext("2d");
				if (!ctx) {
					reject(new Error("Failed to get canvas 2D context."));
					return;
				}

				// Smooth scaling interpolation for better quality
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";

				// Draw resized image onto canvas
				ctx.drawImage(img, 0, 0, width, height);

				// Use WebP for superior quality-to-size ratio, fallback to PNG for SVG/icons
				let mimeType = file.type;
				if (
					mimeType === "image/svg+xml" ||
					mimeType === "image/x-icon"
				) {
					mimeType = "image/png";
				} else {
					// Default to webp for clean compression and transparency support
					mimeType = "image/webp";
				}

				// Export to Base64 data URL
				const compressedDataUrl = canvas.toDataURL(
					mimeType,
					quality || 0.95,
				);
				resolve(compressedDataUrl);
			};
			img.onerror = (err) => reject(err);
			img.src = e.target?.result as string;
		};
		reader.onerror = (err) => reject(err);
		reader.readAsDataURL(file);
	});
}

/**
 * Async file picker that reads file content (Base64 for images with optional resize/prompt, plain text for code/data),
 * and returns the metadata and content.
 */
export async function pickFile({
	fileFormat = ".html,.htm,.csv,.json,.css,.txt,.js,image/*",
	width,
	quality = 0.95,
	askWidth = false,
}: {
	fileFormat?: string;
	width?: number;
	quality?: number;
	askWidth?: boolean;
} = {}): Promise<PickedFileResult | null> {
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
			confirmText: "Continue",
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

	let targetWidth = width;
	let targetQuality = quality;

	// 3. Optional interactive width prompt for images if requested
	if (isImage && askWidth && (!targetWidth || targetWidth <= 0)) {
		const historyResize: { width: number; quality: number } =
			(await db.read("img-resize")) || { width: 100, quality: 95 };

		const oldBase64 = await readAsBase64(file);
		const newBase64 = await resizeAndCompressImage(
			file,
			historyResize.width,
			historyResize.quality,
		);

		const bodyDiv = document.createElement("div");

		bodyDiv.className = "text-center";
		bodyDiv.innerHTML = renderTemplate(imgResize, {
			oriLength: formatFileSize(oldBase64.length),
			newLength: formatFileSize(newBase64.length),
			preview: `style="background-image:url('${newBase64}');"`,
			width: historyResize.width,
			quality: historyResize.quality,
		});

		const widthEl = bodyDiv.querySelector(
			"#prompt-width-input",
		)! as HTMLInputElement;
		const qualityEl = bodyDiv.querySelector(
			"#prompt-quality-input",
		)! as HTMLInputElement;

		const prevEl = bodyDiv.querySelector(
			"#prompt-preview",
		)! as HTMLDivElement;
		const prevLabel = bodyDiv.querySelector(
			"#prompt-preview-label span",
		)! as HTMLSpanElement;

		const updatePreview = async () => {
			const w = parseInt(widthEl.value, 10);
			const q = parseInt(qualityEl.value, 10) / 100;

			if (w > 0 && q > 0) {
				const currentBase64 = await resizeAndCompressImage(file, w, q);
				prevEl.style.backgroundImage = `url('${currentBase64}')`;
				prevLabel.innerHTML = `Original <b>${formatFileSize(oldBase64.length)}</b>, New <b>${formatFileSize(currentBase64.length)}</b>`;
			}
		};

		widthEl.addEventListener("input", updatePreview);
		qualityEl.addEventListener("input", updatePreview);

		const confirmed = await Modal.show({
			body: bodyDiv,
			confirmText: "Resize",
			cancelText: "Keep Original",
			showCancel: true,
		});

		if (confirmed) {
			// Capture user-defined width
			if (widthEl) {
				const parsedWidth = parseInt(widthEl.value, 10);
				if (!isNaN(parsedWidth) && parsedWidth > 0) {
					targetWidth = parsedWidth;
				}
			}
			// Capture user-defined quality
			if (qualityEl) {
				const parsedQuality = parseInt(qualityEl.value, 10);
				if (!isNaN(parsedQuality)) {
					targetQuality = parsedQuality / 100;
				}
			}

			await db.write("img-resize", {
				width: targetWidth,
				quality: targetQuality * 100,
			});
		}
	}

	// 4. Read content safely using the captured user settings
	let content: string;
	if (isImage) {
		if (targetWidth !== undefined && targetWidth > 0) {
			content = await resizeAndCompressImage(
				file,
				targetWidth,
				targetQuality,
			);
		} else {
			content = await readAsBase64(file);
		}
	} else {
		content = await file.text();
	}

	return {
		fileName: fileNameWithoutExt,
		fileType: file.type || (isImage ? "image" : "text/plain"),
		extention: extension,
		content,
	};
}

export function attachCopyFile(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			setButtonLoading(btn, true);

			const fileContent = await pickFile({
				askWidth: true,
			});

			// User cancelled file selection dialog -> exit silently
			if (!fileContent) {
				setButtonLoading(btn, false);
				return;
			}

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
		} finally {
			setButtonLoading(btn, false);
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
			const fileContent = await pickFile({
				fileFormat: "image/*",
				width: 85,
				quality: 0.95,
			});

			// User cancelled file selection dialog -> exit silently
			if (!fileContent) return;

			input.value = fileContent.content;

			target.innerHTML = "";
			target.style = "";

			if (fileContent.content) {
				if (fileContent.content.startsWith("data:image/svg")) {
					target.innerHTML = base64SvgToSvg(fileContent.content);
				} else {
					target.style =
						`background-image:url("${fileContent.content}");${!fileContent.content.startsWith("data:image/svg") ? "background-size:cover;" : ""}` ||
						"";
				}
			}
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to process file: ${message}`);
		}
	});
}

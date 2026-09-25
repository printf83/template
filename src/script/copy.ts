export interface PickedFileResult {
	fileName: string;
	fileType: string;
	content: string; // Base64 for images, text for code/data
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

/** Dynamically mounts hidden input[type="file"], prompts user, and cleans up */
function selectFile(accept: string): Promise<File | null> {
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

/**
 * Async file picker that reads file content (Base64 for images, plain text for code/data),
 * copies it directly to the clipboard, and returns the metadata.
 */
async function pickAndCopyFile(): Promise<PickedFileResult | null> {
	// 1. Prompt file selection dialog
	const file = await selectFile(".html,.htm,.csv,.json,.css,.js,image/*");
	if (!file) return null;

	const isImage = file.type.startsWith("image/");

	// 2. Read content (Base64 for images, file.text() for plain text)
	const content = isImage ? await readAsBase64(file) : await file.text();

	// 3. Copy to clipboard
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(content);
	} else {
		const textArea = document.createElement("textarea");
		textArea.value = content;
		textArea.style.position = "fixed";
		textArea.style.left = "-9999px";
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("copy");
		textArea.remove();
	}

	return {
		fileName: file.name,
		fileType: file.type || (isImage ? "image" : "text/plain"),
		content,
	};
}

export function attachCopyFile(btn: HTMLButtonElement) {
	if (btn) {
		btn.addEventListener("click", () => {
			pickAndCopyFile();
		});
	}
}

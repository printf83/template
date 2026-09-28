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
	const { renderIcons } = await import("./icon");
	renderIcons();
}

// Dynamic load default data
export async function initData() {
	const { data } = await import("../data/template_letter");
	return data;
}

export const getElementById = <T extends HTMLElement = HTMLElement>(
	id: string,
): T => {
	return document.getElementById(id) as T;
};

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

import { copyTextToSystemClipboard, readTextFromSystemClipboard } from "./copy";
import { Toast } from "./toast";
import { initIcons, renderTemplate } from "./utils";
import shortListItem from "../html/editor/short-item.html?raw";

function addItem(
	container: HTMLElement,
	data?: { key?: string; value?: string },
) {
	if (!container) return;

	// Append directly to the container
	container.insertAdjacentHTML(
		"beforeend",
		renderTemplate(shortListItem, data),
	);

	const item = container.lastElementChild as HTMLDivElement;
	if (!item) return;

	const btnDelete = item.querySelector("button.btn-delete");
	if (!btnDelete) return;

	btnDelete.addEventListener(
		"click",
		() => {
			item.remove();
		},
		{ once: true },
	);
}

export function attachAddShortDictionary(
	btn: HTMLButtonElement,
	container: HTMLDivElement,
) {
	if (!btn || !container) return;

	btn.addEventListener("click", () => {
		addItem(container);
		initIcons();
	});
}

export function attachCopyShortDictionary(
	btn: HTMLButtonElement,
	container: HTMLDivElement,
) {
	if (!btn || !container) return;

	btn.addEventListener("click", async () => {
		const result = getShortDictionaryData(container);

		if (Object.keys(result).length === 0) {
			Toast.warning("The Short Dictionary is empty.");
			return;
		}

		try {
			const success = await copyTextToSystemClipboard(
				JSON.stringify(result, null, 2),
			);
			if (success) {
				Toast.success(
					`Successfully copied <strong>Short Dictionary</strong> to your clipboard.`,
				);
			}
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to copy Short Dictionary: ${message}`);
		}
	});
}

export function attachPasteShortDictionary(
	btn: HTMLButtonElement,
	container: HTMLDivElement,
) {
	if (!btn || !container) return;

	btn.addEventListener("click", async () => {
		// 1. Read clipboard content
		const value = await readTextFromSystemClipboard();
		if (!value) {
			Toast.warning("Clipboard is empty or access was denied.");
			return;
		}

		try {
			const data = JSON.parse(value);

			// 2. Validate that parsed data is a valid key-value object (and not an array/primitive)
			if (
				typeof data !== "object" ||
				data === null ||
				Array.isArray(data)
			) {
				throw new Error(
					"Clipboard content is not a valid dictionary object.",
				);
			}

			// 4. Update dictionary items
			setShortDictionaryData(container, data, true);

			Toast.success(
				`Successfully pasted <strong>Short Dictionary</strong> from your clipboard.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to paste Short Dictionary: ${message}`);
		}
	});
}

export function setShortDictionaryData(
	container: HTMLDivElement,
	data: Record<string, string>,
	append: boolean = false,
) {
	if (!container) return;

	// Clear existing items
	if (!append) {
		container
			.querySelectorAll("div.short-list-item")
			.forEach((el) => el.remove());
	}

	if (data) {
		Object.entries(data).forEach(([key, value]) => {
			addItem(container, { key, value });
		});

		initIcons();
	}
}

export function getShortDictionaryData(
	container: HTMLDivElement,
): Record<string, string> {
	if (!container) return {};

	const result: Record<string, string> = {};
	const items = container.querySelectorAll("div.short-list-item");

	items.forEach((item) => {
		const key = (
			item.querySelector("input.long-editor") as HTMLInputElement
		)?.value.trim();
		const value = (
			item.querySelector("input.short-editor") as HTMLInputElement
		)?.value;

		if (key) {
			result[key] = value;
		}
	});

	return result;
}

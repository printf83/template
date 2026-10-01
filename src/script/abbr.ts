import { copyTextToSystemClipboard, readTextFromSystemClipboard } from "./copy";
import { Toast } from "./toast";
import { initIcons, renderTemplate } from "./utils";
import abbrListItem from "../html/editor/abbr-item.html?raw";

function addItem(
	list: HTMLDivElement,
	data?: { key?: string; value?: string },
) {
	if (!list) return;

	// Append directly to the container
	list.insertAdjacentHTML("beforeend", renderTemplate(abbrListItem, data));

	const item = list.lastElementChild as HTMLDivElement;
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

export function attachAddAbbr(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

	btn.addEventListener("click", () => {
		addItem(list);
		initIcons();
	});
}

export function attachCopyAbbr(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

	btn.addEventListener("click", async () => {
		const result = getAbbrData(list);

		if (Object.keys(result).length === 0) {
			Toast.warning("The abbreviation list is empty.");
			return;
		}

		try {
			const success = await copyTextToSystemClipboard(
				JSON.stringify(result, null, 2),
			);
			if (success) {
				Toast.success(
					`Successfully copied abbreviation list to your clipboard.`,
				);
			}
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to copy abbreviation list: ${message}`);
		}
	});
}

export function attachPasteAbbr(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

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
			setAbbrData(list, data, true);

			Toast.success(
				`Successfully pasted abbreviation list from your clipboard.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to paste abbreviation list: ${message}`);
		}
	});
}

export function setAbbrData(
	list: HTMLDivElement,
	data: Record<string, string>,
	append: boolean = false,
) {
	if (!list) return;

	// Clear existing items
	if (!append) {
		list.querySelectorAll("div.abbr-list-item").forEach((el) =>
			el.remove(),
		);
	}

	if (data) {
		Object.entries(data).forEach(([key, value]) => {
			addItem(list, { key, value });
		});

		initIcons();
	}
}

export function getAbbrData(list: HTMLDivElement): Record<string, string> {
	if (!list) return {};

	const result: Record<string, string> = {};
	const items = list.querySelectorAll("div.abbr-list-item");

	items.forEach((item) => {
		const key = (
			item.querySelector("input.abbr-long") as HTMLInputElement
		)?.value.trim();
		const value = (
			item.querySelector("input.abbr-short") as HTMLInputElement
		)?.value;

		if (key) {
			result[key] = value;
		}
	});

	return result;
}

import { copyTextToSystemClipboard, readTextFromSystemClipboard } from "./copy";
import { Toast } from "./toast";
import { initIcons, renderTemplate } from "./utils";
import abbrListItem from "../html/editor/abbr-item.html?raw";
import { Modal } from "./modal";

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
		const resultLength = Object.keys(result).length;

		if (resultLength === 0) {
			Toast.warning("The abbreviation list is empty.");
			return;
		}

		try {
			const success = await copyTextToSystemClipboard(
				JSON.stringify(result, null, 2),
			);
			if (success) {
				Toast.success(
					`Successfully copied ${resultLength} abbreviation list to your clipboard.`,
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
			const data = JSON.parse(value) as Record<string, string>;

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

			// 3. Count replacements vs new items
			const currentData = getAbbrData(list) || {};
			const pastedKeys = Object.keys(data);

			let replaceCount = 0;
			let newCount = 0;

			for (const key of pastedKeys) {
				if (key in currentData) {
					replaceCount++;
				} else {
					newCount++;
				}
			}

			// Prompt user only if there are existing items to replace
			if (replaceCount > 0) {
				const replaceText = `<b>${replaceCount}</b> existing ${replaceCount === 1 ? "abbreviation" : "abbreviations"}`;
				const newText =
					newCount > 0
						? ` and add <b>${newCount}</b> new ${newCount === 1 ? "abbreviation" : "abbreviations"}`
						: "";

				const confirmed = await Modal.confirm(
					`Pasting will overwrite ${replaceText}${newText}. Are you sure you want to continue?`,
					"Overwrite Abbreviations",
					"warning",
				);

				if (!confirmed) return;
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

	// Clear existing items if not appending
	if (!append) {
		list.querySelectorAll("div.abbr-list-item").forEach((el) =>
			el.remove(),
		);
	}

	if (data) {
		Object.entries(data).forEach(([key, value]) => {
			if (append) {
				// Search existing items and remove any match before appending
				const existingItems =
					list.querySelectorAll<HTMLDivElement>("div.abbr-list-item");

				existingItems.forEach((item) => {
					const shortInput =
						item.querySelector<HTMLInputElement>(".abbr-short");
					const longInput =
						item.querySelector<HTMLInputElement>(".abbr-long");

					if (shortInput?.value === key || longInput?.value === key) {
						item.remove();
					}
				});
			}

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

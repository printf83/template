import { copyTextToSystemClipboard, readTextFromSystemClipboard } from "./copy";
import { Toast } from "./toast";
import { initIcons, renderTemplate } from "./utils";
import assetListItem from "../html/editor/asset-item.html?raw";

function addItem(
	list: HTMLDivElement,
	data?: { key?: string; value?: string },
) {
	if (!list) return;

	// Append directly to the container
	list.insertAdjacentHTML("beforeend", renderTemplate(assetListItem, data));

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

export function attachAddAsset(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

	btn.addEventListener("click", () => {
		addItem(list);
		initIcons();
	});
}

export function attachCopyAsset(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

	btn.addEventListener("click", async () => {
		const result = getAssetData(list);

		if (Object.keys(result).length === 0) {
			Toast.warning("The Asset Dictionary is empty.");
			return;
		}

		try {
			const success = await copyTextToSystemClipboard(
				JSON.stringify(result, null, 2),
			);
			if (success) {
				Toast.success(
					`Successfully copied <strong>Asset Dictionary</strong> to your clipboard.`,
				);
			}
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to copy Asset Dictionary: ${message}`);
		}
	});
}

export function attachPasteAsset(btn: HTMLButtonElement, list: HTMLDivElement) {
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
			setAssetData(list, data, true);

			Toast.success(
				`Successfully pasted <strong>Asset Dictionary</strong> from your clipboard.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to paste Asset Dictionary: ${message}`);
		}
	});
}

export function setAssetData(
	list: HTMLDivElement,
	data: Record<string, string>,
	append: boolean = false,
) {
	if (!list) return;

	// Clear existing items
	if (!append) {
		list.querySelectorAll("div.asset-list-item").forEach((el) =>
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

export function getAssetData(list: HTMLDivElement): Record<string, string> {
	if (!list) return {};

	const result: Record<string, string> = {};
	const items = list.querySelectorAll("div.asset-list-item");

	items.forEach((item) => {
		const key = (
			item.querySelector("input.long-editor") as HTMLInputElement
		)?.value.trim();
		const value = (
			item.querySelector("input.asset-editor") as HTMLInputElement
		)?.value;

		if (key) {
			result[key] = value;
		}
	});

	return result;
}

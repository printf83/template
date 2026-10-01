import { copyTextToSystemClipboard, readTextFromSystemClipboard } from "./copy";
import { Toast } from "./toast";
import { initIcons, renderTemplate } from "./utils";
import assetListItem from "../html/editor/asset-item.html?raw";

function getValueType(value?: string): "text" | "image" | "html" {
	if (!value) {
		return "text";
	}
	if (value.startsWith("data:image/")) {
		return "image";
	}
	if (value.includes("<") && value.includes(">")) {
		return "html";
	}
	return "text";
}

function genPreview(value?: string): string {
	if (!value) return "";

	// Simple escaping for text content
	return value
		.slice(0, 50)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function addItem(
	list: HTMLDivElement,
	data?: {
		key?: string;
		value?: string;
	},
) {
	if (!list) return;

	const type = getValueType(data?.value);
	const icon =
		type === "image" ? "image" : type === "html" ? "code-xml" : "file-text";

	const bgStyle =
		type === "image"
			? `style="background-image: url('${data?.value}');"`
			: "";

	const preview = type !== "image" ? genPreview(data?.value) : "";

	// Append directly to the container
	list.insertAdjacentHTML(
		"beforeend",
		renderTemplate(assetListItem, {
			...data,
			icon,
			bgStyle,
			preview,
		}),
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
			Toast.warning("The asset list is empty.");
			return;
		}

		try {
			const success = await copyTextToSystemClipboard(
				JSON.stringify(result, null, 2),
			);
			if (success) {
				Toast.success(
					`Successfully copied asset list to your clipboard.`,
				);
			}
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to copy asset list: ${message}`);
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
				`Successfully pasted asset list from your clipboard.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			Toast.error(`Failed to paste asset list: ${message}`);
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
	const items = list.querySelectorAll<HTMLLabelElement>(".asset-list-item");

	items.forEach((item) => {
		const key = item.dataset.key?.trim();
		const value = item.dataset.value?.trim();

		if (key && key !== undefined && value && value !== undefined) {
			result[key] = value;
		}
	});

	return result;
}

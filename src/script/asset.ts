import {
	copyTextToSystemClipboard,
	pickFile,
	readTextFromSystemClipboard,
} from "./copy";
import { Toast } from "./toast";
import { initIcons, renderTemplate } from "./utils";
import assetListItem from "../html/editor/asset-item.html?raw";
import assetListItemChild from "../html/editor/asset-item-child.html?raw";
import { Modal } from "./modal";
import { createCodeEditor, detectValueType } from "./editor";
import assetEditorHtml from "../html/editor/asset-edit.html?raw";

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

function attachAssetEditor(item: HTMLDivElement) {
	if (!item) return;

	item.addEventListener("dblclick", async () => {
		const key = item.dataset.key || "";
		const value = item.dataset.value || "";

		const assetEditor = document.createElement("div");
		assetEditor.innerHTML = assetEditorHtml;

		const assetEditorKey =
			assetEditor.querySelector<HTMLInputElement>("#asset-key");
		const assetEditorValue =
			assetEditor.querySelector<HTMLDivElement>("#asset-value");

		if (!assetEditorKey || !assetEditorValue) return;

		const valueType = detectValueType(value);

		const codeEditor = createCodeEditor({
			container: assetEditorValue,
			language: valueType,
		});

		assetEditorKey.value = key;
		codeEditor.setValue(value);

		const modalPromise = Modal.show({
			body: assetEditor,
			size: "min-w-[600px]!",
			onShow: () => {
				setTimeout(() => {
					codeEditor.refresh();
				}, 500);
			},
		});

		const result = await modalPromise;

		if (result && codeEditor) {
			const key = assetEditorKey.value;
			const value = codeEditor.getValue() || "";

			item.dataset.key = key;
			item.dataset.value = value;
			codeEditor.destroy();

			//need to replace item
			const temp = genItem(assetListItemChild, { key, value });
			item.innerHTML = temp;
			initIcons();
		}
	});
}

function genItem(template: string, data?: { key?: string; value?: string }) {
	const type = detectValueType(data?.value);

	let icon = "file-text";
	switch (type) {
		case "image":
			icon = "image";
			break;
		case "html":
			icon = "code-xml";
			break;
		case "javascript":
			icon = "scroll-text";
			break;
		case "json":
			icon = "file-braces-corner";
			break;
		case "css":
			icon = "swatch-book";
			break;
		case "csv":
			icon = "table";
			break;
		default:
			icon = "file-text";
	}

	const bgStyle =
		type === "image"
			? `style="background-image: url('${data?.value}');"`
			: "";

	const preview = type !== "image" ? genPreview(data?.value) : "";

	return renderTemplate(template, {
		...data,
		icon,
		bgStyle,
		preview,
	});
}

function addItem(
	list: HTMLDivElement,
	data?: {
		key?: string;
		value?: string;
	},
) {
	if (!list) return;

	const temp = genItem(assetListItem, data);

	// Append directly to the container
	list.insertAdjacentHTML("beforeend", temp);

	const item = list.lastElementChild as HTMLDivElement;
	if (item) {
		attachAssetEditor(item);
	}
}

export function attachAddAsset(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

	btn.addEventListener("click", () => {
		addItem(list);
		initIcons();
	});
}

export function attachUploadAsset(
	btn: HTMLButtonElement,
	list: HTMLDivElement,
) {
	if (!btn || !list) return;

	btn.addEventListener("click", async () => {
		try {
			const fileContent = await pickFile();
			if (!fileContent) return;

			addItem(list, {
				key: fileContent.fileName,
				value: fileContent.content,
			});

			initIcons();
		} catch (error) {}
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

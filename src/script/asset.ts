import {
	copyTextToSystemClipboard,
	pickFile,
	readTextFromSystemClipboard,
} from "./copy";
import { Toast } from "./toast";
import {
	detectValueType,
	escapeSymbol,
	initIcons,
	renderTemplate,
	trimAll,
} from "./utils";
import assetListItem from "../html/editor/asset-item.html?raw";
import assetListItemChild from "../html/editor/asset-item-child.html?raw";
import { Modal } from "./modal";
import { createCodeEditor, type CreatedEditorState } from "./editor";
import assetEditorHtml from "../html/editor/asset-edit.html?raw";
import { isDarkModeActive } from "./dark";

const ICON_MAP: Record<string, string> = {
	image: "image",
	html: "file-code-corner",
	javascript: "scroll-text",
	json: "file-braces-corner",
	css: "swatch-book",
	csv: "table",
};

function genPreview(value?: string): string {
	if (!value) return "";
	return escapeSymbol(trimAll(value).slice(0, 80));
}

export interface AssetData {
	key: string;
	value: string;
}

export async function showAssetEditor(
	data: AssetData,
): Promise<AssetData | null> {
	const assetEditor = document.createElement("div");
	assetEditor.innerHTML = assetEditorHtml;

	const assetEditorKey =
		assetEditor.querySelector<HTMLInputElement>("#asset-key");
	const assetEditorValue =
		assetEditor.querySelector<HTMLDivElement>("#asset-value");

	if (!assetEditorKey || !assetEditorValue) return null;

	const assetEditorValueContainer =
		assetEditorValue.previousElementSibling as HTMLDivElement;
	assetEditorValueContainer.setAttribute(
		"data-filename",
		data.key || "asset-value",
	);

	assetEditorKey.addEventListener("change", () => {
		assetEditorValueContainer.setAttribute(
			"data-filename",
			assetEditorKey.value || "asset-value",
		);
	});

	assetEditorKey.value = data.key;

	const valueType = detectValueType(data.value);
	let codeEditor: CreatedEditorState | null = null;

	let cleanupThemeListeners: () => void = () => {};

	// Wait for the modal promise
	const result = await Modal.show<boolean>({
		body: assetEditor,
		size: "max-w-xl!",
		confirmText: "Save",
		onShow: () => {
			const isDark = isDarkModeActive();

			// Mount code editor only after DOM attachment
			codeEditor = createCodeEditor({
				container: assetEditorValue,
				language: valueType,
				initialValue: data.value,
				isDark,
			});

			// 1. Listen for OS / Browser Theme Changes
			const mediaQuery = window.matchMedia(
				"(prefers-color-scheme: dark)",
			);
			const handleSystemThemeChange = (_e: MediaQueryListEvent) => {
				const isDark = isDarkModeActive();
				codeEditor?.setTheme(isDark);
			};
			mediaQuery.addEventListener("change", handleSystemThemeChange);

			const observer = new MutationObserver(() => {
				const isDark = isDarkModeActive();
				codeEditor?.setTheme(isDark);
			});

			// 2. Listen for HTML class toggles (e.g., user clicks a theme toggle button)
			observer.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class"],
			});

			// 3. Store cleanup function
			cleanupThemeListeners = () => {
				mediaQuery.removeEventListener(
					"change",
					handleSystemThemeChange,
				);
				observer.disconnect();
			};

			// Safely focus editor after modal renders
			requestAnimationFrame(() => {
				if (!data.key) {
					assetEditorKey.focus();
				} else {
					if (codeEditor && codeEditor.view) {
						codeEditor.view.focus();
					}
				}
			});
		},
	});

	const activeEditor = codeEditor as CreatedEditorState | null;

	let returnData: AssetData | null = null;

	if (result && activeEditor) {
		const key = assetEditorKey.value.trim();
		const value = activeEditor.getValue() || "";

		if (key) {
			returnData = { key, value };
		}
	}

	// Always destroy instance to prevent memory leaks
	cleanupThemeListeners();
	if (activeEditor) activeEditor.destroy();

	return returnData;
}

function attachAssetEditor(item: HTMLDivElement) {
	if (!item) return;

	item.addEventListener("click", async (e) => {
		// Ignore clicks originating from the delete control
		const target = e.target as HTMLElement;
		if (target.closest(".asset-item-control")) return;

		const key = item.dataset.key || "";
		const value = item.dataset.value || "";

		const result = await showAssetEditor({ key, value });

		if (result) {
			item.dataset.key = result.key;
			item.dataset.value = result.value;

			// Re-render inner markup with updated key and value
			item.innerHTML = genItem(assetListItemChild, {
				key: result.key,
				value: result.value,
			});

			initIcons();
			// Re-bind delete listener to newly created DOM elements
			attachAssetDelete(item);
		}
	});
}

function attachAssetDelete(item: HTMLDivElement) {
	if (!item) return;

	const del = item.querySelector(".asset-item-control");
	if (!del) return;

	del.addEventListener("click", async (e: Event) => {
		e.stopPropagation(); // Stop event bubbling to item click listener

		const target = e.target as HTMLDivElement;
		const title = target
			.closest(".asset-list-item")
			?.getAttribute("data-key");

		const result = await Modal.confirm(
			`Are you sure you want to remove the <b>${title}</b> asset?`,
			"Remove Asset",
		);
		if (result) {
			item.remove();
		}
	});
}

function genItem(template: string, data?: { key?: string; value?: string }) {
	const type = detectValueType(data?.value);
	const icon = ICON_MAP[type] ?? "file-text";

	const bgStyle =
		type === "image"
			? `style="background-image: url('${data?.value}');${!data?.value?.startsWith("data:image/svg") ? "background-size:cover;" : ""}"`
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

	list.insertAdjacentHTML("beforeend", temp);

	const item = list.lastElementChild as HTMLDivElement;
	if (item) {
		attachAssetEditor(item);
		attachAssetDelete(item);
	}
}

export function attachAddAsset(btn: HTMLButtonElement, list: HTMLDivElement) {
	if (!btn || !list) return;

	btn.addEventListener("click", async () => {
		const result = await showAssetEditor({ key: "", value: "" });

		if (result) {
			addItem(list, result);
			initIcons();
		}
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
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to upload file.";
			Toast.error(message);
		}
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
		const value = await readTextFromSystemClipboard();
		if (!value) {
			Toast.warning("Clipboard is empty or access was denied.");
			return;
		}

		try {
			const data = JSON.parse(value);

			if (
				typeof data !== "object" ||
				data === null ||
				Array.isArray(data)
			) {
				throw new Error(
					"Clipboard content is not a valid dictionary object.",
				);
			}

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
	const items = list.querySelectorAll<HTMLElement>(".asset-list-item");

	items.forEach((item) => {
		const key = item.dataset.key?.trim();
		const value = item.dataset.value?.trim();

		if (key && value) {
			result[key] = value;
		}
	});

	return result;
}

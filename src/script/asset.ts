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

const ERROR_CLASS = "is-duplicate";

export function validateAsset(list: HTMLDivElement) {
	if (!list) return;

	const items = Array.from(
		list.querySelectorAll<HTMLDivElement>("div.asset-list-item"),
	);

	// 1. Reset error class on all item containers
	items.forEach((item) => item.classList.remove(ERROR_CLASS));

	// 2. Group items by dataset key (trimmed)
	const keyGroups = new Map<string, HTMLDivElement[]>();

	items.forEach((item) => {
		const key = item.dataset.key?.trim() || "";

		if (!keyGroups.has(key)) {
			keyGroups.set(key, []);
		}
		keyGroups.get(key)!.push(item);
	});

	// 3. Mark duplicates (all instances except the last one in DOM order)
	keyGroups.forEach((matchedItems) => {
		if (matchedItems.length > 1) {
			const duplicatesToMark = matchedItems.slice(0, -1);
			duplicatesToMark.forEach((item) => {
				item.classList.add(ERROR_CLASS);
			});
		}
	});
}

export interface AssetData {
	key: string;
	value: string;
}

function disableBtnConfirm(input: HTMLInputElement) {
	const modal = input.closest(".modal") as HTMLDivElement;
	if (!modal) return;

	const btnConfirm = modal.querySelector(".btn-confirm") as HTMLButtonElement;
	if (!btnConfirm) return;

	btnConfirm.disabled = input.value.trim() === "";
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

	const assetEditorKeyContainer = assetEditorKey.closest(
		".form-field",
	) as HTMLDivElement;
	if (assetEditorKeyContainer) {
		assetEditorKey.addEventListener("keyup", () => {
			disableBtnConfirm(assetEditorKey);
		});
	}

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
				disableBtnConfirm(assetEditorKey);

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
			attachAssetDelete(item);

			// Re-validate list when key is modified in the modal
			const parent = item.parentElement as HTMLDivElement;
			if (parent) validateAsset(parent);
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
			const parent = item.parentElement as HTMLDivElement;
			item.remove();

			// Re-validate remaining list after deletion
			if (parent) validateAsset(parent);
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

	// Validate duplicate keys on new additions
	validateAsset(list);
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
		const resultLength = Object.keys(result).length;
		if (resultLength === 0) {
			Toast.warning("The asset list is empty.");
			return;
		}

		try {
			const success = await copyTextToSystemClipboard(
				JSON.stringify(result, null, 2),
			);
			if (success) {
				Toast.success(
					`Successfully copied ${resultLength} asset list to your clipboard.`,
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
			const data = JSON.parse(value) as Record<string, string>;

			if (
				typeof data !== "object" ||
				data === null ||
				Array.isArray(data)
			) {
				throw new Error(
					"Clipboard content is not a valid dictionary object.",
				);
			}

			// 1. Get existing asset data from the current DOM list
			const currentData = getAssetData(list) || {};
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

			// 2. Prompt user only if there are items to replace
			if (replaceCount > 0) {
				const replaceText = `<b>${replaceCount}</b> existing ${replaceCount === 1 ? "asset" : "assets"}`;
				const newText =
					newCount > 0
						? ` and add <b>${newCount}</b> new ${newCount === 1 ? "asset" : "assets"}`
						: "";

				const confirmed = await Modal.confirm(
					`Pasting will overwrite ${replaceText}${newText}. Are you sure you want to continue?`,
					"Overwrite Assets",
					"warning",
				);

				if (!confirmed) return;
			}

			// 3. Apply assets to list
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

	// Clear the entire list if not appending
	if (!append) {
		list.querySelectorAll("div.asset-list-item").forEach((el) =>
			el.remove(),
		);
	}

	if (data) {
		Object.entries(data).forEach(([key, value]) => {
			if (append) {
				// Instantly locate and remove any existing item with the same data-key
				const existingItem = list.querySelector<HTMLDivElement>(
					`div.asset-list-item[data-key="${CSS.escape(key)}"]`,
				);
				existingItem?.remove();
			}

			// Append the new item
			addItem(list, { key, value });
		});

		initIcons();
		validateAsset(list);
	}
}

export function getAssetData(list: HTMLDivElement): Record<string, string> {
	if (!list) return {};

	const result: Record<string, string> = {};
	const items = list.querySelectorAll<HTMLElement>(".asset-list-item");

	items.forEach((item) => {
		const key = item.dataset.key?.trim();
		const value = item.dataset.value?.trim();

		if (key) {
			result[key] = value || "";
		}
	});

	return result;
}

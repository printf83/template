import type { Data, SchemaItem } from "../type/data";
import { setEditData } from "./edit";
import { Modal } from "./modal";
import { Toast } from "./toast";
import newList from "../html/editor/new-list.html?raw";
import newListItem from "../html/editor/new-item.html?raw";
import { renderTemplate } from "./utils";
import {
	getPreloadTemplateTargets,
	loadTargetModule,
	type TargetKey,
} from "./preload"; // Import loadTargetModule

export function attachEditorNew(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const formEl = document.createElement("form");

		// 1. Initial loading state shown immediately inside the modal
		formEl.innerHTML = newList;

		// Double-click shortcut delegate
		formEl.addEventListener("dblclick", (e) => {
			const label = (e.target as HTMLElement).closest("label");
			if (!label) return;

			const radio = label.querySelector<HTMLInputElement>(
				'input[type="radio"]',
			);
			if (radio) {
				radio.checked = true;
			}

			const confirmBtn = formEl
				.closest("dialog")
				?.querySelector<HTMLButtonElement>(".btn-confirm");

			confirmBtn?.click();
		});

		// 2. Open Modal immediately!
		const modalPromise = Modal.show({
			body: formEl,
			confirmText: "Use This Template",
			size: "max-w-3xl!",
		});

		// 3. Define target keys list
		const targetKeys: TargetKey[] = getPreloadTemplateTargets();

		let templateMap: Record<string, Data<SchemaItem[]>> = {};

		// Fetch modules in parallel using loadTargetModule with retries
		const fetchTemplatesTask = (async () => {
			try {
				const entries = await Promise.all(
					targetKeys.map(async (key) => {
						const mod = await loadTargetModule<{
							data: Data<SchemaItem[]>;
						}>(key);
						return [key, mod.data] as const;
					}),
				);

				templateMap = Object.fromEntries(entries);

				// Render list items once imports complete
				const templateItems = Object.entries(templateMap)
					.map(([key, d], index) => {
						return renderTemplate(newListItem, {
							bgStyle: d.thumb
								? `style="background-image: url('${d.thumb}')"`
								: "",
							title: d.title,
							key: key,
							isChecked: index === 0 ? "checked" : "",
						});
					})
					.join("");

				// Replace loading spinner with loaded template list
				const listEl = formEl.querySelector(".thumb-list");
				if (listEl) {
					listEl.innerHTML = templateItems;
				}
			} catch (error) {
				const msg =
					error instanceof Error
						? error.message
						: "Failed to load templates.";
				Toast.error(msg);
			}
		})();

		// 4. Handle modal submission
		const result = await modalPromise;

		if (result) {
			// Guard: ensure templates finished loading before evaluating selection
			await fetchTemplatesTask;

			const selectedOption = formEl.querySelector<HTMLInputElement>(
				'input[name="thumb-list-item"]:checked',
			);

			const templateValue = selectedOption?.value;
			if (templateValue && templateMap[templateValue]) {
				setEditData(templateMap[templateValue]);

				Toast.success(
					`Successfully using template <strong>${templateMap[templateValue].title}</strong>`,
				);
			}
		}
	});
}

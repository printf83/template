import type { Data, SchemaItem } from "../type/data";
import { db } from "./db"; // Ensure db is imported
import { getEditData, setEditData } from "./edit";
import { Modal } from "./modal";
import { Toast } from "./toast";
import newList from "../html/editor/new-list.html?raw";
import newListItem from "../html/editor/new-item.html?raw";
import newListItemDelete from "../html/editor/new-item-delete.html?raw";
import { initIcons, renderTemplate } from "./utils";
import {
	getPreloadTemplateTargets,
	getPreloadTestTargets,
	loadTargetModule,
} from "./preload";

function renderItem(
	d: Data<SchemaItem[]>,
	key: string,
	allowDelete: boolean = false,
	isChecked: boolean = false,
) {
	return renderTemplate(newListItem, {
		del: allowDelete ? newListItemDelete : "",
		bgStyle: d.thumb
			? `style="background-image: url('${d.thumb}');${allowDelete && !d.thumb.startsWith("data:image/svg") ? "background-size:contain;" : ""}"`
			: "",
		title: d.title,
		key: key,
		isChecked: isChecked ? "checked" : "",
	});
}

function divider(label: string, id?: string) {
	return `<div ${id ? `id="${id}"` : ""} class="divider">${label}</div>`;
}

function attachDeleteItem(
	list: HTMLDivElement,
	allTemplatesMap?: Record<string, Data<SchemaItem[]>>,
) {
	if (!list) return;

	const dels = list.querySelectorAll(".new-item-delete");
	dels.forEach((elem) => {
		elem.addEventListener("click", async (ev) => {
			ev.preventDefault();
			ev.stopPropagation();

			const target = ev.currentTarget as HTMLElement;
			const container = target.closest(".new-item") as HTMLLabelElement;
			if (!container) return;

			const radioInput = container.querySelector<HTMLInputElement>(
				'input[name="new-list-item"]',
			);
			const key = radioInput?.value;
			const wasChecked = radioInput?.checked;

			const titleSpan =
				container.querySelector<HTMLSpanElement>(".new-item-title");
			const title = titleSpan?.innerText || key || "this";

			const confirmed = await Modal.confirm(
				`Are you sure to remove this <b>${title}</b> template?`,
				"Remove Template?",
			);

			if (!confirmed) return;

			try {
				// 1. Read existing user-template object from IndexedDB
				const userTemplates =
					(await db.read<Record<string, Data<SchemaItem[]>>>(
						"user-template",
					)) || {};

				if (key && key in userTemplates) {
					// 2. Delete key from IndexedDB dictionary
					delete userTemplates[key];
					await db.write("user-template", userTemplates);

					// 3. Remove key from in-memory map
					if (allTemplatesMap) {
						delete allTemplatesMap[key];
					}

					// 4. Remove DOM node
					container.remove();

					// 5. Remove divider if no user template left
					const userTemplateLength =
						list.querySelectorAll<HTMLDivElement>(
							".new-item-delete",
						).length;
					if (userTemplateLength === 0) {
						list.querySelector("#new-divider-user")?.remove();
					}

					// 5. If the deleted template was checked, auto-select the next available template
					if (wasChecked) {
						const nextRadio = list.querySelector<HTMLInputElement>(
							'input[name="new-list-item"]',
						);
						if (nextRadio) {
							nextRadio.checked = true;
						}
					}

					Toast.success(`Template <b>${title}</b> was removed.`);
				}
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Failed to delete template.";
				Toast.error(message);
			}
		});
	});
}

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
		const templateKeys = getPreloadTemplateTargets();
		const testKeys = getPreloadTestTargets();

		let allTemplatesMap: Record<string, Data<SchemaItem[]>> = {};

		// Fetch user templates, system templates, and test modules in parallel
		const fetchTemplatesTask = (async () => {
			try {
				const loadGroup = async (keys: typeof templateKeys) => {
					const entries = await Promise.all(
						keys.map(async (key) => {
							const mod = await loadTargetModule<{
								data: Data<SchemaItem[]>;
							}>(key);
							return [key, mod.data] as const;
						}),
					);
					return Object.fromEntries(entries);
				};

				// Fetch user templates from DB & bundled modules concurrently
				const [userMapRaw, templateMap, testMap] = await Promise.all([
					db.read<Record<string, Data<SchemaItem[]>>>(
						"user-template",
					),
					loadGroup(templateKeys),
					loadGroup(testKeys),
				]);

				const userMap = userMapRaw || {};
				const userEntries = Object.entries(userMap);
				const hasUserTemplates = userEntries.length > 0;

				// Merge into single lookup map
				allTemplatesMap = { ...userMap, ...templateMap, ...testMap };

				// Render User Templates (Check the 1st user item if available)
				const userItems = userEntries
					.map(([key, d], index) =>
						renderItem(d, key, true, index === 0),
					)
					.join("");

				// Render System Templates (Check the 1st template item ONLY if no user templates exist)
				const templateItems = Object.entries(templateMap)
					.map(([key, d], index) =>
						renderItem(
							d,
							key,
							false,
							!hasUserTemplates && index === 0,
						),
					)
					.join("");

				// Render Test Templates
				const testItems = Object.entries(testMap)
					.map(([key, d]) => renderItem(d, key))
					.join("");

				// Section header for User Templates
				const userSection = hasUserTemplates
					? `${divider("User Templates", "new-divider-user")}${userItems}`
					: "";

				// Replace loading spinner with loaded template list
				const listEl = formEl.querySelector(
					".new-list",
				) as HTMLDivElement;
				if (listEl) {
					listEl.innerHTML = `${userSection}${divider("System Templates")}${templateItems}${divider("Test")}${testItems}`;

					if (hasUserTemplates) {
						initIcons();
						attachDeleteItem(listEl, allTemplatesMap);
					}
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
				'input[name="new-list-item"]:checked',
			);

			const templateValue = selectedOption?.value;
			if (templateValue && allTemplatesMap[templateValue]) {
				const selectedTemplate = allTemplatesMap[templateValue];
				setEditData(selectedTemplate);

				Toast.success(
					`Successfully using template <strong>${selectedTemplate.title}</strong>`,
				);
			}
		}
	});
}

export function attachEditorSave(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const data = getEditData();

		// Guard: Ensure there is valid data and a title
		if (!data || !data.title?.trim()) {
			Toast.warning(
				"Please provide a valid template title before saving.",
			);
			return;
		}

		const confirmed = await Modal.confirm(
			`This will be saved as <b>${data.title}</b> in your custom template list.`,
			"Save Template?",
		);

		if (!confirmed) return;

		try {
			// 1. Read existing user templates or fallback to an empty object
			const listOfUserTemplate =
				(await db.read<Record<string, Data<SchemaItem[]>>>(
					"user-template",
				)) || {};

			// 2. Generate a key based on title (or timestamp)
			const templateKey = data.title
				.toLowerCase()
				.trim()
				.replace(/\s+/g, "_");

			// 3. Save / Update in user template map
			listOfUserTemplate[templateKey] = data;

			// 4. Persist back to the database
			await db.write("user-template", listOfUserTemplate);

			Toast.success(
				`Successfully saved <b>${data.title}</b> to your templates.`,
			);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to save template to local database.";
			Toast.error(message);
		}
	});
}

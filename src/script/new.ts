import type { Data, SchemaItem } from "../type/data";
import { db } from "./db"; // Ensure db is imported
import { getEditData, setEditData, validateDuplicate } from "./edit";
import { Modal } from "./modal";
import { Toast } from "./toast";
import newList from "../html/editor/new-list.html?raw";
import newListItem from "../html/editor/new-item.html?raw";
import newListItemDelete from "../html/editor/new-item-delete.html?raw";
import { initIcons, renderTemplate } from "./utils";

function renderItem(
	d: Data<SchemaItem[]>,
	key: string,
	allowDelete: boolean = false,
	isChecked: boolean = false,
) {
	return renderTemplate(newListItem, {
		del: allowDelete ? newListItemDelete : "",
		bgStyle: d.thumb
			? `style="background-image: url('${d.thumb}');${!d.thumb.startsWith("data:image/svg") ? "background-size:cover;" : ""}"`
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
				`Are you sure you want to remove the <b>${title}</b> template?`,
				"Remove Template",
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
			confirmText: "Use This",
			size: "max-w-3xl!",
		});

		let allTemplatesMap: Record<string, Data<SchemaItem[]>> = {};

		// Fetch user templates & load modules directly via dynamic import() in parallel
		const fetchTemplatesTask = (async () => {
			try {
				// Execute user DB read and module imports concurrently
				const [userMapRaw, systemEntries, testEntries] =
					await Promise.all([
						db.read<Record<string, Data<SchemaItem[]>>>(
							"user-template",
						),

						// Direct dynamic imports for System Templates (order preserved)
						Promise.all([
							import("../data/template_letter").then(
								(m) => ["letter", m.data] as const,
							),
							import("../data/template_letter_bg").then(
								(m) => ["letter_bg", m.data] as const,
							),
						]),

						// Direct dynamic imports for Test Templates (order preserved)
						Promise.all([
							import("../data/template_csv").then(
								(m) => ["csv", m.data] as const,
							),
							import("../data/template_json").then(
								(m) => ["json", m.data] as const,
							),
							import("../data/template_function").then(
								(m) => ["function", m.data] as const,
							),
							import("../data/template_command").then(
								(m) => ["command", m.data] as const,
							),
							import("../data/template_command_2").then(
								(m) => ["command_2", m.data] as const,
							),
							import("../data/template_script").then(
								(m) => ["script", m.data] as const,
							),
							import("../data/template_style").then(
								(m) => ["style", m.data] as const,
							),
							import("../data/template_asset").then(
								(m) => ["asset", m.data] as const,
							),
							import("../data/template_picture").then(
								(m) => ["picture", m.data] as const,
							),
							import("../data/template_100").then(
								(m) => ["100", m.data] as const,
							),
							import("../data/template_500").then(
								(m) => ["500", m.data] as const,
							),
							import("../data/template_1K").then(
								(m) => ["1K", m.data] as const,
							),
						]),
					]);

				const userMap = userMapRaw || {};
				const userEntries = Object.entries(userMap);
				const hasUserTemplates = userEntries.length > 0;

				// Combine all entries to construct the lookup map without breaking render order
				allTemplatesMap = Object.fromEntries([
					...userEntries,
					...systemEntries,
					...testEntries,
				]);

				// 1. Render User Templates
				const userItems = userEntries
					.map(([key, d], index) =>
						renderItem(d, key, true, index === 0),
					)
					.join("");

				// 2. Render System Templates (Iterate directly over systemEntries array to preserve order)
				const templateItems = systemEntries
					.map(([key, d], index) =>
						renderItem(
							d,
							key,
							false,
							!hasUserTemplates && index === 0,
						),
					)
					.join("");

				// 3. Render Test Templates (Iterate directly over testEntries array to preserve order)
				const testItems = testEntries
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
		const confirmedValidate = await validateDuplicate();
		if (!confirmedValidate) return;

		const data = await getEditData();
		if (!data) return;

		// Guard: Ensure there is valid data and a title
		if (!data.title?.trim()) {
			Modal.alert(
				"Please provide a valid template title before saving.",
				"Save Template",
				"error",
			);
			return;
		}

		const confirmed = await Modal.confirm(
			`Do you want to save this as <b>${data.title}</b> in your custom template list?`,
			"Save Template",
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

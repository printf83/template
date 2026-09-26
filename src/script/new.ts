import type { Data, SchemaItem } from "../type/data";
import { setEditData } from "./edit";
import { Modal } from "./modal";
import { Toast } from "./toast";

export function attachEditorNew(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const formEl = document.createElement("form");

		// 1. Initial loading state shown immediately inside the modal
		formEl.innerHTML = `
            <div class="new-list">
                <div class="flex w-full h-full gap-3 justify-center items-center">
                    <i data-icon="loader-circle" class="size-6"></i>
					Loading templates...
                </div>
            </div>
        `;

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

		// 3. Start fetching dynamic imports while modal is visible
		let templateMap: Record<string, Data<SchemaItem[]>> = {};

		const fetchTemplatesTask = (async () => {
			const [csv, json, fn, cmd] = await Promise.all([
				import("../data/template_csv"),
				import("../data/template_json"),
				import("../data/template_function"),
				import("../data/template_command"),
			]);

			templateMap = {
				t1: csv.data,
				t2: json.data,
				t3: fn.data,
				t4: cmd.data,
			};

			// Render list items once imports complete
			const templateItems = Object.entries(templateMap)
				.map(([key, d], index) => {
					const bgStyle = d.thumb
						? `style="background-image: url('${d.thumb}')"`
						: "";
					const isChecked = index === 0 ? "checked" : "";

					return `<label ${bgStyle}>
                        <span class="text-xs font-medium">${d.title}</span>
                        <input type="radio" name="new-list-item" value="${key}" ${isChecked}>
                    </label>`;
				})
				.join("");

			// Replace loading spinner with loaded template list
			const listEl = formEl.querySelector(".new-list");
			if (listEl) {
				listEl.innerHTML = templateItems;
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
			if (templateValue && templateMap[templateValue]) {
				setEditData(templateMap[templateValue]);

				Toast.success(
					`Successfully using template <strong>${templateMap[templateValue].title}</strong>`,
				);
			}
		}
	});
}

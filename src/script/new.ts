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
            <div class="thumb-list">
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
			const targets = {
				csv: () => import("../data/template_csv"),
				json: () => import("../data/template_json"),
				function: () => import("../data/template_function"),
				command: () => import("../data/template_command"),
				command2: () => import("../data/template_command_2"),
				picture: () => import("../data/template_picture"),
				asset: () => import("../data/template_asset"),
				letter: () => import("../data/template_letter"),
				t100: () => import("../data/template_100"),
				t500: () => import("../data/template_500"),
				t1K: () => import("../data/template_1K"),
			};

			const entries = await Promise.all(
				Object.entries(targets).map(async ([key, load]) => [
					key,
					(await load()).data,
				]),
			);

			templateMap = Object.fromEntries(entries);

			// Render list items once imports complete
			const templateItems = Object.entries(templateMap)
				.map(([key, d], index) => {
					const bgStyle = d.thumb
						? `style="background-image: url('${d.thumb}')"`
						: "";
					const isChecked = index === 0 ? "checked" : "";

					return `<label ${bgStyle}>
                        <span class="text-xs font-medium">${d.title}</span>
                        <input type="radio" name="thumb-list-item" value="${key}" ${isChecked}>
                    </label>`;
				})
				.join("");

			// Replace loading spinner with loaded template list
			const listEl = formEl.querySelector(".thumb-list");
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

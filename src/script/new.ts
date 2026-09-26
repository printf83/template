import { data as test_0001 } from "../data/test_0001";
import { data as test_0002 } from "../data/test_0002";
import type { Data, SchemaItem } from "../type/data";
import { setEditData } from "./edit";
import { Modal } from "./modal";

export function attachEditorNew(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const formEl = document.createElement("form");

		const template: Record<string, Data<SchemaItem[]>> = {
			t1: test_0001,
			t2: test_0002,
		};

		const templateItem = Object.entries(template)
			.map(([key, d], index) => {
				const bgStyle = d.thumb
					? `style="background-image: url('${d.thumb}')"`
					: "";
				const isChecked = index === 0 ? "checked" : "";

				return `<label ${bgStyle}>
					<span class="text-xs font-medium">${d.title}</span>
					<input type="radio" name="new-list-item" value="${key}" ${isChecked}>
				</label>
			`;
			})
			.join("");

		formEl.innerHTML = `
            <div class="new-list">
                ${templateItem}
            </div>
        `;

		const result = await Modal.show({
			// title: "Select Template",
			body: formEl,
			confirmText: "Use This Template",
			size: "max-w-3xl!",
		});

		if (result) {
			// Retrieve the value of the checked radio button
			const selectedOption = formEl.querySelector<HTMLInputElement>(
				'input[name="new-list-item"]:checked',
			);

			const templateValue = selectedOption?.value;
			if (templateValue && template[templateValue])
				setEditData(template[templateValue]);
		}
	});
}

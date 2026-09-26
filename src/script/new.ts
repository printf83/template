import { Modal } from "./modal";

export function attachEditorNew(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const formEl = document.createElement("form");

		formEl.innerHTML = `
            <div class="new-list">
                <label>
                    <span class="text-xs font-medium">Blank</span>
                    <input type="radio" name="new-list-item" value="blank" checked>
                </label>

                <label>
                    <span class="text-xs font-medium">Invoice</span>
                    <input type="radio" name="new-list-item" value="invoice">
                </label>

                <label>
                    <span class="text-xs font-medium">Receipt</span>
                    <input type="radio" name="new-list-item" value="receipt">
                </label>
            </div>
        `;

		const result = await Modal.show({
			title: "Select Template",
			body: formEl,
			confirmText: "Create",
			size: "min-w-3xl!",
		});

		if (result) {
			// Retrieve the value of the checked radio button
			const selectedOption = formEl.querySelector<HTMLInputElement>(
				'input[name="new-list-item"]:checked',
			);

			const templateValue = selectedOption?.value;
			console.log("Selected template:", templateValue);
		}
	});
}

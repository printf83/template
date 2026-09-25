import { Modal } from "./modal";

export function attachEditorNew(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const formEl = document.createElement("form");
		formEl.innerHTML = `
            <div class="h-80">
                <input type="text" id="template-name" class="input" placeholder="e.g. Invoice Template" required style="width: 100%; padding: 0.5rem;"/>
            </div>
        `;

		const result = await Modal.show({
			body: formEl,
			confirmText: "Create",
			size: "min-w-2xl!",
		});

		if (result) {
			const input =
				formEl.querySelector<HTMLInputElement>("#template-name");
			console.log("New template name:", input?.value);
		}
	});
}

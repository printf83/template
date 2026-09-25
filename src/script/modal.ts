import { renderIcons } from "./icon";

export interface ModalOptions {
	icon?: string;
	title: string;
	body?: string | HTMLElement;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
}

export class Modal {
	/**
	 * Renders an interactive promise-based modal dialog using Tailwind CSS.
	 * Resolves to `true` on confirm, or `null` on cancel/dismiss.
	 */
	static show<T = boolean>(options: ModalOptions): Promise<T | null> {
		return new Promise((resolve) => {
			const dialog = document.createElement("dialog");
			dialog.className = "modal";
			dialog.innerHTML = `
                <div class="modal-content">
                    <header class="modal-header">
                        <h3 class="modal-title">
							${options.icon ? `<i data-icon="${options.icon}"></i>` : ""}
							<span>${options.title}</span>
						</h3>
                        <button type="button" class="modal-close " aria-label="Close">&times;</button>
                    </header>
                    <div class="modal-body"></div>
                    <footer class="modal-footer">
                        ${
							options.showCancel !== false
								? `<button type="button" class="btn-cancel btn-secondary">${
										options.cancelText ?? "Cancel"
									}</button>`
								: ""
						}
                        <button type="button" class="btn-confirm btn-primary">${
							options.confirmText ?? "Confirm"
						}</button>
                    </footer>
                </div>
            `;

			// Populate body content
			const bodyEl = dialog.querySelector<HTMLDivElement>(".modal-body")!;
			if (options.body instanceof HTMLElement) {
				bodyEl.appendChild(options.body);
			} else if (typeof options.body === "string") {
				bodyEl.innerHTML = options.body;
			}

			document.body.appendChild(dialog);
			dialog.showModal();

			setTimeout(() => {
				renderIcons();
			}, 100);

			// Safe cleanup helper
			const cleanup = (value: T | null) => {
				dialog.close();
				dialog.remove();
				resolve(value);
			};

			// Event Listeners
			const closeBtn = dialog.querySelector(".modal-close");
			const cancelBtn = dialog.querySelector(".btn-cancel");
			const confirmBtn = dialog.querySelector(".btn-confirm");

			closeBtn?.addEventListener("click", () => cleanup(null));
			cancelBtn?.addEventListener("click", () => cleanup(null));
			confirmBtn?.addEventListener("click", () =>
				cleanup(true as unknown as T),
			);

			// Close when clicking native backdrop area
			dialog.addEventListener("click", (e) => {
				if (e.target === dialog) {
					cleanup(null);
				}
			});

			// Handle ESC key press natively
			dialog.addEventListener("cancel", (e) => {
				e.preventDefault();
				cleanup(null);
			});
		});
	}

	/** Quick helper for confirmation prompts */
	static confirm(
		message: string,
		title = "Confirm Action",
		icon = "circle-question-mark",
	): Promise<boolean> {
		return this.show({
			icon,
			title,
			body: `<p>${message}</p>`,
			showCancel: true,
			confirmText: "Confirm",
		}).then((res) => res === true);
	}

	/** Quick helper for alert messages */
	static alert(
		message: string,
		title = "Notice",
		icon = "info",
	): Promise<void> {
		return this.show({
			icon,
			title,
			body: `<p>${message}</p>`,
			showCancel: false,
			confirmText: "OK",
		}).then(() => undefined);
	}
}

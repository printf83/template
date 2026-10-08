import { initIcons } from "./utils";

export type ModalType = "info" | "warning" | "error" | "success" | "question";

export interface ModalOptions {
	type?: ModalType;
	title?: string;
	body?: string | HTMLElement;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
	size?: string;
	onShow?: (dlg: HTMLDialogElement) => void;
}

export class Modal {
	/**
	 * Renders an interactive promise-based modal dialog using Tailwind CSS.
	 * Resolves to `true` on confirm, or `null` on cancel/dismiss.
	 */
	static show<T = boolean>(options: ModalOptions): Promise<T | null> {
		return new Promise((resolve) => {
			let modalIconData: string | null = null;
			let modalIconClass: string | null = null;
			if (options.type) {
				switch (options.type) {
					case "error":
						modalIconData = "circle-x";
						modalIconClass =
							"text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-950/60 rounded-full";
						break;
					case "success":
						modalIconData = "circle-check";
						modalIconClass =
							"text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 rounded-full";
						break;
					case "question":
						modalIconData = "circle-question-mark";
						modalIconClass =
							"text-emerald-500 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 rounded-full";
						break;
					case "info":
						modalIconData = "info";
						modalIconClass =
							"text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 rounded-full";
						break;
					case "warning":
						modalIconData = "circle-alert";
						modalIconClass =
							"text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 rounded-full";
						break;
				}
			}

			const modalIcon = modalIconData
				? `<i ${modalIconClass ? `class="${modalIconClass}"` : ""} data-icon="${modalIconData}"></i>`
				: "";
			const modalHeader =
				options.title || modalIconData
					? `<header class="modal-header">
                        <h3 class="modal-title">
							${modalIcon}
							<span>${options.title}</span>
						</h3>
                        <button type="button" class="modal-close " aria-label="Close">&times;</button>
                    </header>`
					: "";

			const dialog = document.createElement("dialog");
			dialog.className = `modal ${options.size} translate-y-4 opacity-0 scale-95`;
			dialog.innerHTML = `
                <div class="modal-content">
                    ${modalHeader}
                    <div class="modal-body"></div>
                    <footer class="modal-footer">
                        ${
							options.showCancel !== false
								? `<button type="button" class="btn-lg btn-cancel btn-secondary">${
										options.cancelText ?? "Cancel"
									}</button>`
								: ""
						}
                        <button type="button" class="btn-lg btn-confirm btn-primary">${
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

			initIcons();

			// -------------------------------------------------------------
			// Call onShow hook now that dialog is mounted and open in DOM
			// -------------------------------------------------------------
			if (typeof options.onShow === "function") {
				options.onShow(dialog);
			}

			// Animate in
			requestAnimationFrame(() => {
				dialog.classList.remove(
					"translate-y-4",
					"opacity-0",
					"scale-95",
				);
				dialog.classList.add(
					"translate-y-0",
					"opacity-100",
					"scale-100",
				);
			});

			// Safe cleanup helper
			const cleanup = (value: T | null) => {
				dialog.classList.remove(
					"translate-y-0",
					"opacity-100",
					"scale-100",
				);
				dialog.classList.add("translate-y-2", "opacity-0", "scale-95");

				dialog.addEventListener(
					"transitionend",
					() => {
						dialog.close();
						dialog.remove();
						resolve(value);
					},
					{ once: true },
				);
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
			let isMouseDownOnBackdrop = false;
			// 1. Track where the click initiated
			dialog.addEventListener("mousedown", (e) => {
				isMouseDownOnBackdrop = e.target === dialog;
			});

			// 2. Only close if both the press AND release occurred directly on the backdrop
			dialog.addEventListener("click", (e) => {
				if (e.target === dialog && isMouseDownOnBackdrop) {
					cleanup(null);
				}

				// Reset state
				isMouseDownOnBackdrop = false;
			});

			// Handle ESC key press natively
			dialog.addEventListener("cancel", (e) => {
				e.preventDefault();
				cleanup(null);
			});
		});
	}

	/** Quick helper for confirmation prompts */
	static async confirm(
		message: string,
		title = "Confirm Action",
		type: ModalType = "question",
	): Promise<boolean> {
		return this.show({
			type,
			title,
			body: `<p class="pb-4 text-gray-700 dark:text-zinc-300 text-sm text-center">${message}</p>`,
			showCancel: true,
			confirmText: "Confirm",
		}).then((res) => res === true);
	}

	/** Quick helper for alert messages */
	static async alert(
		message: string,
		title = "Notice",
		type: ModalType = "info",
	): Promise<void> {
		await this.show({
			type,
			title,
			body: `<p class="pb-4 text-gray-700 dark:text-zinc-300 text-sm text-center">${message}</p>`,
			showCancel: false,
			confirmText: "OK",
		});
		return undefined;
	}
}

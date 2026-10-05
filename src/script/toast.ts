import { initIcons } from "./utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
	message: string;
	type?: ToastType;
	duration?: number; // Duration in ms (default: AUTO_CLOSE_DURATIONms, 0 = persistent)
}

const AUTO_CLOSE_DURATION = 5_000;

const TOAST_ICONS: Record<ToastType, string> = {
	success: "circle-check",
	error: "circle-x",
	warning: "circle-alert",
	info: "info",
};

export class Toast {
	private static container: HTMLDivElement | null = null;

	/**
	 * Lazily creates and returns the singleton container for toasts.
	 */
	private static getContainer(): HTMLDivElement {
		if (!this.container) {
			this.container = document.createElement("div");
			this.container.id = "toast-container";
			this.container.setAttribute("popover", "manual");
			this.container.className = "toast-container";
			document.body.appendChild(this.container);
		}

		// Refresh Top Layer stacking order every time getContainer is called
		try {
			this.container.hidePopover();
		} catch {
			// Safe catch if container was not open yet
		}
		this.container.showPopover();

		return this.container;
	}

	/**
	 * Displays a toast notification.
	 */
	static show(
		options: ToastOptions | string,
		type: ToastType = "info",
	): void {
		const message = typeof options === "string" ? options : options.message;
		const toastType =
			typeof options === "string" ? type : (options.type ?? "info");
		const duration =
			typeof options === "string"
				? AUTO_CLOSE_DURATION
				: (options.duration ?? AUTO_CLOSE_DURATION);

		const container = this.getContainer();
		const toast = document.createElement("div");

		const icon = TOAST_ICONS[toastType];

		// Layout, variant class, and initial animation state (hidden)
		toast.className = `toast toast-${toastType} translate-y-4 opacity-0 scale-95`;

		toast.innerHTML = `
            <div class="toast-body">
                <i data-icon="${icon}"></i>
                <div class="toast-content">${message}</div>
            </div>
            <button type="button" class="toast-close">&times;</button>
			<div class="progress-container">
				<div class="progress">
					<div class="progress-bar" style="--duration: ${duration}ms;"></div>
				</div>
			</div>
        `;

		container.appendChild(toast);
		initIcons();

		// Animate in
		requestAnimationFrame(() => {
			toast.classList.remove("translate-y-4", "opacity-0", "scale-95");
			toast.classList.add("translate-y-0", "opacity-100", "scale-100");
		});

		// Dismiss action
		let timer: ReturnType<typeof setTimeout> | null = null;

		const dismiss = () => {
			if (timer) clearTimeout(timer);
			toast.classList.remove("translate-y-0", "opacity-100", "scale-100");
			toast.classList.add("translate-y-2", "opacity-0", "scale-95");

			toast.addEventListener(
				"transitionend",
				() => {
					toast.remove();
				},
				{ once: true },
			);
		};

		// Close button listener
		toast.querySelector(".toast-close")?.addEventListener("click", dismiss);

		// Auto dismiss timer
		if (duration > 0) {
			timer = setTimeout(dismiss, duration);
		}
	}

	/** Helper for success toasts */
	static success(message: string, duration?: number): void {
		this.show({ message, type: "success", duration });
	}

	/** Helper for error toasts */
	static error(message: string, duration?: number): void {
		this.show({ message, type: "error", duration });
	}

	/** Helper for warning toasts */
	static warning(message: string, duration?: number): void {
		this.show({ message, type: "warning", duration });
	}

	/** Helper for info toasts */
	static info(message: string, duration?: number): void {
		this.show({ message, type: "info", duration });
	}
}

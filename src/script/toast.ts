import { initIcons } from "./utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
	message: string;
	type?: ToastType;
	duration?: number; // Duration in ms (default: DEFAULT_AUTO_DISMISS_DURATIONms, 0 = persistent)
}

const AUTO_CLOSE_DURATION = 5000;

export class Toast {
	private static container: HTMLDivElement | null = null;

	/**
	 * Lazily creates and returns the singleton container for toasts.
	 */
	private static getContainer(): HTMLDivElement {
		if (!this.container) {
			this.container = document.createElement("div");
			this.container.id = "toast-container";
			this.container.className =
				"fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none";
			document.body.appendChild(this.container);
		}
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

		// Styling variants matching WCAG contrast standards
		const typeStyles: Record<
			ToastType,
			{ bg: string; border: string; text: string; icon: string }
		> = {
			success: {
				bg: "bg-emerald-50",
				border: "border-emerald-200",
				text: "text-emerald-800",
				icon: `circle-check`,
			},
			error: {
				bg: "bg-red-50",
				border: "border-red-200",
				text: "text-red-800",
				icon: `circle-x`,
			},
			warning: {
				bg: "bg-amber-50",
				border: "border-amber-200",
				text: "text-amber-900",
				icon: `circle-alert`,
			},
			info: {
				bg: "bg-blue-50",
				border: "border-blue-200",
				text: "text-blue-800",
				icon: `info`,
			},
		};

		const style = typeStyles[toastType];

		// Layout & Initial animation state (hidden)
		toast.className = `toast ${style.bg} ${style.border} ${style.text} translate-y-4 opacity-0 scale-95`;

		toast.innerHTML = `
            <div class="toast-body">
                <i data-icon="${style.icon}"></i>
                <div class="toast-content">${message}</div>
            </div>
            <button type="button" class="toast-close ">&times;</button>
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

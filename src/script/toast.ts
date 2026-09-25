import { renderIcons } from "./icon";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
	message: string;
	type?: ToastType;
	duration?: number; // Duration in ms (default: 3000ms, 0 = persistent)
}

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
			typeof options === "string" ? 3000 : (options.duration ?? 3000);

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
		toast.className = `pointer-events-auto flex items-center justify-between gap-3 p-3 rounded-xl border shadow-lg ${style.bg} ${style.border} ${style.text} transition-all duration-300 transform translate-y-4 opacity-0 scale-95`;

		toast.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="size-8" data-icon="${style.icon}"></i>
                <span class="text-sm font-medium">${message}</span>
            </div>
            <button type="button" class="toast-close bg-transparent border-0 text-gray-400 hover:text-gray-700 cursor-pointer p-0.5 rounded-md leading-none text-lg transition-colors">&times;</button>
        `;

		container.appendChild(toast);
		renderIcons();

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

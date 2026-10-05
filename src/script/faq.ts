import { Modal } from "./modal";

export function attachBtnFaq(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			const { default: faqText } = await import("../assets/faq.html?raw");

			Modal.show({
				title: "Frequently Asked Questions",
				type: "question",
				body: `
				<div class="bg-neutral-50 border dark:bg-zinc-900 border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden inset-shadow-xs">
					<div class="max-h-[calc(100svh-460px)] min-h-75 overflow-y-auto p-2">
						${faqText}
					</div>
				</div>`,
				size: "max-w-[600px]!",
				confirmText: "Okay",
				showCancel: false,
			});
		} catch (error) {
			console.error("Failed to load FAQ module:", error);
		}
	});
}

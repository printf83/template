import { Modal } from "./modal";
import { getPreloadFaqTarget, loadTargetModule } from "./preload"; // Import loadTargetModule

export function attachBtnFaq(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			// Safely fetch faq content with retries via loadTargetModule
			const faqModule = await loadTargetModule<{ default: string }>(
				getPreloadFaqTarget(),
			);
			const faqText = faqModule.default;

			Modal.show({
				title: "Frequently Asked Questions",
				type: "question",
				body: `<div class="max-h-[calc(100svh-460px)] bg-neutral-50 border border-neutral-200 rounded-lg overflow-y-auto p-2 inset-shadow-xs">${faqText}</div>`,
				size: "min-w-[600px]!",
				confirmText: "Okay",
				showCancel: false,
			});
		} catch (error) {
			console.error("Failed to load FAQ module:", error);
		}
	});
}

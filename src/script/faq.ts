import { Modal } from "./modal";

export function attachBtnFaq(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			// Dynamically import faq.txt only when the user clicks
			const faqModule = await import("../assets/faq.html?raw");
			const faqText = faqModule.default;

			Modal.show({
				title: "Frequently Asked Questions",
				type: "question",
				body: `<div class="bg-neutral-50 border border-neutral-200 rounded-lg max-h-96 overflow-y-auto p-2 inset-shadow-sm">${faqText}</div>`,
				size: "min-w-[600px]!",
				confirmText: "Okay",
				showCancel: false,
			});
		} catch (error) {
			console.error("Failed to load FAQ module:", error);
		}
	});
}

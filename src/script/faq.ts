import { Modal } from "./modal";

export function attachBtnFaq(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			const { default: faqText } = await import("../assets/faq.html?raw");

			Modal.show({
				title: "Frequently Asked Questions",
				type: "question",
				body: `<div class="max-h-[calc(100svh-460px)] min-h-75 bg-neutral-50 border border-neutral-200 rounded-xl overflow-y-auto p-2 inset-shadow-xs">${faqText}</div>`,
				size: "max-w-[600px]!",
				confirmText: "Okay",
				showCancel: false,
			});
		} catch (error) {
			console.error("Failed to load FAQ module:", error);
		}
	});
}

import { Modal } from "./modal";
import { Toast } from "./toast";

export function attachBtnFaq(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		try {
			const { default: faqText } = await import("../assets/faq.html?raw");

			Modal.show({
				title: "Frequently Asked Questions",
				type: "question",
				body: `
				<div class="bg-neutral-50 border dark:bg-zinc-950 border-neutral-200 dark:border-zinc-800 rounded-lg overflow-hidden inset-shadow-xs dark:inset-shadow-zinc-100/10">
					<div class="faq-container-scroll overflow-y-auto p-2">
						${faqText}
					</div>
				</div>`,
				size: "max-w-[600px]!",
				confirmText: "Okay",
				showCancel: false,
			});
		} catch (error) {
			const msg =
				error instanceof Error ? error.message : "Unknown error.";
			Toast.error(msg);
		}
	});
}

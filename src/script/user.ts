import { Modal } from "./modal";
import userKeyForm from "../html/user.html?raw";

export function attachBtnUserKey(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const container = document.createElement("div");

		container.innerHTML = userKeyForm;

		const userKeyInput = container.querySelector(
			"#user-key",
		) as HTMLInputElement;

		if (userKeyInput) {
			const result = await Modal.show({
				body: container,
				confirmText: "Continue",
			});

			if (result) {
				const userKey = userKeyInput.value.trim();
				if (userKey) {
					// Constructs target URL dynamically matching origin (e.g. http://localhost:5173 or production domain)
					const targetUrl = new URL(
						"/template/",
						window.location.origin,
					);
					targetUrl.searchParams.set("uid", userKey);

					window.location.href = targetUrl.toString();
				}
			}
		}
	});
}

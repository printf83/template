import { Modal } from "./modal";
import userKeyForm from "../html/user.html?raw";
import { getUserName } from "./db";

async function showLogin() {
	const container = document.createElement("div");

	container.innerHTML = userKeyForm;

	const userNameInput = container.querySelector(
		"#user-name",
	) as HTMLInputElement;

	const userKeyInput = container.querySelector(
		"#user-password",
	) as HTMLInputElement;

	if (userNameInput && userKeyInput) {
		const result = await Modal.show({
			body: container,
			confirmText: "Continue",
		});

		if (result) {
			const userName = userNameInput.value.trim();
			const userPass = userKeyInput.value;

			if (userName && userPass) {
				// Constructs target URL dynamically matching origin (e.g. http://localhost:5173 or production domain)
				const targetUrl = new URL("/template/", window.location.origin);

				targetUrl.searchParams.set("uname", userName);
				targetUrl.searchParams.set("upass", userPass);

				window.location.href = targetUrl.toString();
			}
		}
	}
}

async function logout() {
	const result = await Modal.confirm(
		"You will be sign in as guest",
		"Sign Out?",
	);
	if (result) {
		const targetUrl = new URL("/template/", window.location.origin);

		targetUrl.searchParams.delete("uname");
		targetUrl.searchParams.delete("upass");

		window.location.href = targetUrl.toString();
	}
}

export function attachBtnUserKey(btn: HTMLButtonElement) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const currentUserName = getUserName();
		if (!currentUserName || currentUserName === "Guest") {
			showLogin();
		} else {
			await logout();
		}
	});
}

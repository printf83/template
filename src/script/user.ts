import { Modal } from "./modal";
import { Toast } from "./toast";
import userKeyForm from "../html/user.html?raw";
import { getUserName, login, logout } from "./auth";

function attachKeyReturn(elem: HTMLInputElement, callback: () => void) {
	if (!elem) return;

	elem.addEventListener("keypress", (e) => {
		if (e.code === "Enter" || e.code === "NumpadEnter") {
			e.preventDefault();
			callback();
		} else {
			console.log(e.code);
		}
	});
}

async function showLogin() {
	const container = document.createElement("div");
	container.innerHTML = userKeyForm;

	const userNameInput = container.querySelector(
		"#user-name",
	) as HTMLInputElement;

	const userPassInput = container.querySelector(
		"#user-password",
	) as HTMLInputElement;

	if (userNameInput && userPassInput) {
		attachKeyReturn(userNameInput, () => {
			userPassInput.focus();
		});

		attachKeyReturn(userPassInput, () => {
			const confirmBtn = container
				.closest("dialog")
				?.querySelector<HTMLButtonElement>(".btn-confirm");

			confirmBtn?.click();
		});

		const result = await Modal.show({
			body: container,
			confirmText: "Sign In",
		});

		if (result) {
			const userName = userNameInput.value.trim();
			const userPass = userPassInput.value;

			if (userName && userPass) {
				const loginResult = await login(userName, userPass);

				switch (loginResult.status) {
					case "registered":
						Toast.success(
							`User "${loginResult.uname}" successfully registered!`,
						);
						break;
					case "welcome":
						Toast.success(`Welcome back, ${loginResult.uname}!`);
						break;
					case "invalid_password":
						Toast.error("Incorrect password!");
						break;
					case "guest":
						Toast.info("Signed in as Guest");
						break;
				}
			}
		}
	}
}

async function handleLogout() {
	const result = await Modal.confirm(
		"You will be signed in as guest",
		"Sign Out?",
	);
	if (result) {
		await logout();
		Toast.info("Signed in as Guest");
	}
}

export function attachBtnUserKey(
	btn: HTMLButtonElement,
	onAuthChange?: () => void,
) {
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const currentUserName = getUserName();
		if (!currentUserName || currentUserName === "Guest") {
			await showLogin();
		} else {
			await handleLogout();
		}
		onAuthChange?.();
	});
}

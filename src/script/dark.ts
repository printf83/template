import { initIcons } from "./utils";

/** Helper to check if dark mode is currently active */
export function isDarkModeActive(): boolean {
	const savedTheme = localStorage.getItem("theme");

	// Explicit user choice in localStorage takes priority
	if (savedTheme === "dark") return true;
	if (savedTheme === "light") return false;

	// Fallback to DOM classes
	const hasDarkClass = document.documentElement.classList.contains("dark");
	const hasLightClass = document.documentElement.classList.contains("light");
	if (hasDarkClass) return true;
	if (hasLightClass) return false;

	// Final fallback to system OS preference
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function attachBtnTheme(btn: HTMLButtonElement) {
	if (!btn) return;

	const updateThemeState = (isDark: boolean) => {
		const iconTarget = btn.querySelector("svg, [data-icon]");
		if (!iconTarget) return;

		const newIcon = document.createElement("i");
		newIcon.dataset.icon = isDark ? "moon" : "sun-medium";

		iconTarget.replaceWith(newIcon);
		initIcons();
	};

	// Initial setup with updated check
	updateThemeState(isDarkModeActive());

	// Click listener
	btn.addEventListener("click", () => {
		const isDark = isDarkModeActive();

		if (isDark) {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
			localStorage.setItem("theme", "light");
			updateThemeState(false);
		} else {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
			updateThemeState(true);
		}
	});
}

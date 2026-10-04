const templateTargets = {
	csv: () => import("../data/template_csv"),
	json: () => import("../data/template_json"),
	function: () => import("../data/template_function"),
	command: () => import("../data/template_command"),
	command2: () => import("../data/template_command_2"),
	picture: () => import("../data/template_picture"),
	asset: () => import("../data/template_asset"),
	style: () => import("../data/template_style"),
	script: () => import("../data/template_script"),
	letter: () => import("../data/template_letter"),
	t100: () => import("../data/template_100"),
	t500: () => import("../data/template_500"),
	t1K: () => import("../data/template_1K"),
};

const othersTargets = {
	icon: () => import("./icon"),
	faq: () => import("../assets/faq.html?raw"),
};

const targets = {
	...templateTargets,
	...othersTargets,
};

export function getPreloadTemplateTargets(): TargetKey[] {
	return Object.keys(templateTargets) as TargetKey[];
}

export function getPreloadDefaultTemplateTarget(): TargetKey {
	return "script" as TargetKey;
}

export function getPreloadFaqTarget(): TargetKey {
	return "faq" as TargetKey;
}

export function getPreloadIconTarget(): TargetKey {
	return "icon" as TargetKey;
}

export type TargetKey = keyof typeof targets;

/**
 * Safely loads a template module by key with automatic retry logic.
 */
export async function loadTargetModule<T = unknown>(
	key: TargetKey,
	retries = 2,
): Promise<T> {
	const importFn = targets[key];
	if (!importFn) {
		throw new Error(`Template key "${key}" does not exist.`);
	}

	try {
		return (await importFn()) as T;
	} catch (error) {
		if (retries > 0) {
			// Wait 1 second before retrying
			await new Promise((res) => setTimeout(res, 1000));
			return loadTargetModule<T>(key, retries - 1);
		}
		throw new Error(
			`Failed to load template "${key}". Please check your internet connection.`,
		);
	}
}

/**
 * Background preloader that accepts an array of keys (or preloads all if omitted/empty)
 * during browser idle time without blocking the UI.
 */
export function preloadTemplates() {
	const runPreload = () => {
		const targetKeys = Object.keys(targets) as TargetKey[];

		targetKeys.forEach((key) => {
			if (key in targets) {
				loadTargetModule(key).catch(() => {
					console.log(`Fail preload ${key}`);
				});
			}
		});
	};

	// Check global directly so TypeScript doesn't narrow 'window' to 'never' in 'else'
	if (typeof requestIdleCallback === "function") {
		requestIdleCallback(() => runPreload(), { timeout: 2000 });
	} else if (document.readyState === "complete") {
		runPreload();
	} else {
		window.addEventListener("load", runPreload, { once: true });
	}
}

import { rules, ARBITRARY_PROPERTIES, ALL_COLORS } from "./rules";

/**
 * Returns an array of all statically supported class names.
 */
export function getAllSupportedClasses(): string[] {
	return Object.keys(rules);
}

/**
 * Generates a full summary report including static classes and dynamic patterns.
 */
export function generateClassReport() {
	const staticClasses = getAllSupportedClasses();

	console.log(`Total Static Utility Classes: ${staticClasses.length}\n`);

	// Categorized breakdown preview
	const categories: Record<string, string[]> = {
		Spacing: staticClasses.filter((c) => /^(p|m)[trblxy]?-\d+/.test(c)),
		Sizing: staticClasses.filter((c) =>
			/^(w|h|min-w|max-w|min-h|max-h)-/.test(c),
		),
		Colors: staticClasses.filter((c) => /^(bg|text|border)-/.test(c)),
		Borders: staticClasses.filter((c) => /^(border|rounded)/.test(c)),
		FlexGrid: staticClasses.filter((c) =>
			/^(flex|grid|col|row|items|justify|self)-/.test(c),
		),
		Transform: staticClasses.filter((c) =>
			/^(-?rotate|-?translate|scale)-/.test(c),
		),
		Page: staticClasses.filter((c) =>
			/^(page|a[345]|letter|legal|tabloid)/.test(c),
		),
	};

	console.log("=== STATIC CLASS SUMMARY ===");
	for (const [cat, items] of Object.entries(categories)) {
		console.log(`${cat}: ${items.length} classes`);
	}

	console.log("\n=== SUPPORTED DYNAMIC / ARBITRARY PATTERNS ===");
	console.log(
		"1. Arbitrary Values:  [prefix]-[value] (e.g., p-[20px], w-[50%], z-[999])",
	);
	console.log(
		"   Supported prefixes:",
		Object.keys(ARBITRARY_PROPERTIES).join(", "),
	);
	console.log(
		"2. Color Opacity:     [bg|text|border]-[color]/[opacity] (e.g., bg-black/50, bg-red-500/[0.2])",
	);
	console.log(
		"3. Variants:          even:[class], odd:[class] (e.g., even:bg-gray-100)",
	);
	console.log(
		"4. Page Sizing:       page-[width_height] (e.g., page-[210mm_297mm])",
	);
	console.log("5. Web Fonts:         font-[url:...] or font-['Font_Name']");

	return staticClasses;
}

// To export as JSON array string or write to a file:
export function exportClassesToJSON(): string {
	return JSON.stringify(getAllSupportedClasses(), null, 2);
}

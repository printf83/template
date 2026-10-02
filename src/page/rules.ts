import type { PageRuleItem } from "../type/style.d";
import tailwindReset from "../assets/reset.css?raw";
import pagePrintCSS from "../assets/page-print.css?raw";
import pageScreenCSS from "../assets/page-screen.css?raw";

const SPACING_SCALE: Record<string, string> = {
	"0": "0px",
	px: "1px",
	"0.5": "0.125rem",
	"1": "0.25rem",
	"1.5": "0.375rem",
	"2": "0.5rem",
	"2.5": "0.625rem",
	"3": "0.75rem",
	"3.5": "0.875rem",
	"4": "1rem",
	"5": "1.25rem",
	"6": "1.5rem",
	"7": "1.75rem",
	"8": "2rem",
	"9": "2.25rem",
	"10": "2.5rem",
	"11": "2.75rem",
	"12": "3rem",
	"14": "3.5rem",
	"16": "4rem",
	"20": "5rem",
	"24": "6rem",
	"28": "7rem",
	"32": "8rem",
	"36": "9rem",
	"40": "10rem",
	"44": "11rem",
	"48": "12rem",
	"52": "13rem",
	"56": "14rem",
	"60": "15rem",
	"64": "16rem",
	"72": "18rem",
	"80": "20rem",
	"96": "24rem",
};

const FRACTION_SCALE: Record<string, string> = {
	"1/2": "50%",
	"1/3": "33.333333%",
	"2/3": "66.666667%",
	"1/4": "25%",
	"2/4": "50%",
	"3/4": "75%",
	"1/5": "20%",
	"2/5": "40%",
	"3/5": "60%",
	"4/5": "80%",
	"1/6": "16.666667%",
	"5/6": "83.333333%",
	"1/12": "8.333333%",
	"5/12": "41.666667%",
	"7/12": "58.333333%",
	"11/12": "91.666667%",
	full: "100%",
	auto: "auto",
};

// ============================================================================
// SPACING
// ============================================================================

const SPACING_DIRECTIONS: Record<string, string[]> = {
	p: ["padding"],
	pt: ["padding-top"],
	pb: ["padding-bottom"],
	pl: ["padding-left"],
	pr: ["padding-right"],
	px: ["padding-left", "padding-right"],
	py: ["padding-top", "padding-bottom"],
	m: ["margin"],
	mt: ["margin-top"],
	mb: ["margin-bottom"],
	ml: ["margin-left"],
	mr: ["margin-right"],
	mx: ["margin-left", "margin-right"],
	my: ["margin-top", "margin-bottom"],
};

function createSpacingRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {};
	for (const [prefix, cssProps] of Object.entries(SPACING_DIRECTIONS)) {
		for (const [sizeKey, sizeVal] of Object.entries(SPACING_SCALE)) {
			const className = `${prefix}-${sizeKey}`;
			const style = cssProps
				.map((prop) => `${prop}: ${sizeVal};`)
				.join(" ");
			rules[className] = { style };
		}
	}
	return rules;
}

// ============================================================================
// GAP
// ============================================================================

function createGapRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {};
	for (const [sizeKey, sizeVal] of Object.entries(SPACING_SCALE)) {
		rules[`gap-${sizeKey}`] = { style: `gap: ${sizeVal};` };
		rules[`gap-x-${sizeKey}`] = { style: `column-gap: ${sizeVal};` };
		rules[`gap-y-${sizeKey}`] = { style: `row-gap: ${sizeVal};` };
	}
	return rules;
}

// ============================================================================
// LAYOUT
// ============================================================================

const LAYOUT_RULES: Record<string, PageRuleItem> = {
	block: { style: "display: block;" },
	"inline-block": { style: "display: inline-block;" },
	hidden: { style: "display: none;" },
};

// ============================================================================
// ALIGMENT
// ============================================================================

const TEXT_ALIGN: Record<string, PageRuleItem> = {
	"text-left": { style: "text-align: left;" },
	"text-center": { style: "text-align: center;" },
	"text-right": { style: "text-align: right;" },
	"text-justify": { style: "text-align: justify;" },
};

// ============================================================================
// WIDTH, HEIGHT, PRINT DIMENSION
// ============================================================================

interface PageDimension {
	sizeName: string;
	w: string;
	h: string;
}

const PAGE_DIMENSIONS: Record<string, PageDimension> = {
	a4: { sizeName: "A4", w: "210mm", h: "297mm" },
	a3: { sizeName: "A3", w: "297mm", h: "420mm" },
	a5: { sizeName: "A5", w: "148mm", h: "210mm" },
	letter: { sizeName: "Letter", w: "8.5in", h: "11in" },
	legal: { sizeName: "Legal", w: "8.5in", h: "14in" },
	tabloid: { sizeName: "Tabloid", w: "11in", h: "17in" },
};

export function createSizingRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {
		// Base Keyword Utilities
		"w-full": { style: "width: 100%;" },
		"w-auto": { style: "width: auto;" },
		"w-screen": { style: "width: 100vw;" },
		"w-min": { style: "width: min-content;" },
		"w-max": { style: "width: max-content;" },
		"w-fit": { style: "width: fit-content;" },

		"h-full": { style: "height: 100%;" },
		"h-auto": { style: "height: auto;" },
		"h-screen": { style: "height: 100vh;" },
		"h-min": { style: "height: min-content;" },
		"h-max": { style: "height: max-content;" },
		"h-fit": { style: "height: fit-content;" },
	};

	// 1. Populate Fixed Numeric Scale (w-1, h-1, w-2, h-2, etc.)
	for (const [key, value] of Object.entries(SPACING_SCALE)) {
		rules[`w-${key}`] = { style: `width: ${value};` };
		rules[`min-w-${key}`] = { style: `min-width: ${value};` };
		rules[`max-w-${key}`] = { style: `max-width: ${value};` };
		rules[`h-${key}`] = { style: `height: ${value};` };
		rules[`min-h-${key}`] = { style: `min-height: ${value};` };
		rules[`max-h-${key}`] = { style: `max-height: ${value};` };
	}

	// 2. Populate Fraction Utilities (w-1/2, w-3/4, h-1/2, etc.)
	for (const [key, value] of Object.entries(FRACTION_SCALE)) {
		rules[`w-${key}`] = { style: `width: ${value};` };
		rules[`min-w-${key}`] = { style: `min-width: ${value};` };
		rules[`max-w-${key}`] = { style: `max-width: ${value};` };
		rules[`h-${key}`] = { style: `height: ${value};` };
		rules[`min-h-${key}`] = { style: `min-height: ${value};` };
		rules[`max-h-${key}`] = { style: `max-height: ${value};` };
	}

	// 3. Physical Page Dimensions (w-a4, h-a4, w-a3, h-a3)
	for (const key of ["a4", "a3", "letter", "legal", "tabloid"] as const) {
		const dim = PAGE_DIMENSIONS[key];
		rules[`w-${key}`] = { style: `width: ${dim.w};` };
		rules[`h-${key}`] = { style: `height: ${dim.h};` };
	}

	return rules;
}

// ============================================================================
// BORDER & ROUNDED
// ============================================================================

const BORDER_WIDTHS: Record<string, string> = {
	"": "1px",
	"0": "0px",
	"2": "2px",
	"4": "4px",
	"8": "8px",
};

const BORDER_DIRECTIONS: Record<string, string[]> = {
	"": ["border-width"],
	t: ["border-top-width"],
	r: ["border-right-width"],
	b: ["border-bottom-width"],
	l: ["border-left-width"],
	x: ["border-left-width", "border-right-width"],
	y: ["border-top-width", "border-bottom-width"],
};

const BORDER_STYLES: Record<string, string> = {
	"border-solid": "solid",
	"border-dashed": "dashed",
	"border-dotted": "dotted",
	"border-double": "double",
	"border-none": "none",
};

const RADIUS_SIZES: Record<string, string> = {
	none: "0px",
	sm: "0.125rem",
	DEFAULT: "0.25rem",
	md: "0.375rem",
	lg: "0.5rem",
	xl: "0.75rem",
	"2xl": "1rem",
	"3xl": "1.5rem",
	full: "9999px",
};

const RADIUS_CORNERS: Record<string, string[]> = {
	"": ["border-radius"],
	t: ["border-top-left-radius", "border-top-right-radius"],
	r: ["border-top-right-radius", "border-bottom-right-radius"],
	b: ["border-bottom-left-radius", "border-bottom-right-radius"],
	l: ["border-top-left-radius", "border-bottom-left-radius"],
	tl: ["border-top-left-radius"],
	tr: ["border-top-right-radius"],
	br: ["border-bottom-right-radius"],
	bl: ["border-bottom-left-radius"],
};

function createBorderRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {};

	// 1. Generate Border Widths (border, border-2, border-t-4, border-x-2, etc.)
	for (const [dirKey, cssProps] of Object.entries(BORDER_DIRECTIONS)) {
		const prefix = dirKey ? `border-${dirKey}` : "border";

		for (const [sizeKey, sizeVal] of Object.entries(BORDER_WIDTHS)) {
			const className = sizeKey ? `${prefix}-${sizeKey}` : prefix;

			let style = cssProps
				.map((prop) => `${prop}: ${sizeVal};`)
				.join(" ");

			// Base "border" and directional defaults (e.g., border, border-t) set border-style to solid
			if (sizeKey === "" || sizeKey === "1") {
				style += " border-style: solid;";
			}

			rules[className] = { style };
		}
	}

	// 2. Generate Border Styles (border-solid, border-dashed, border-dotted, etc.)
	for (const [className, styleVal] of Object.entries(BORDER_STYLES)) {
		rules[className] = { style: `border-style: ${styleVal};` };
	}

	// 3. Generate Border Radius (rounded, rounded-md, rounded-t-lg, rounded-tl-xl, etc.)
	for (const [cornerKey, cssProps] of Object.entries(RADIUS_CORNERS)) {
		const prefix = cornerKey ? `rounded-${cornerKey}` : "rounded";

		for (const [sizeKey, sizeVal] of Object.entries(RADIUS_SIZES)) {
			let className = prefix;
			if (sizeKey !== "DEFAULT") {
				className = `${prefix}-${sizeKey}`;
			}

			const style = cssProps
				.map((prop) => `${prop}: ${sizeVal};`)
				.join(" ");

			rules[className] = { style };
		}
	}

	return rules;
}

// ============================================================================
// FONT
// ============================================================================

const FONT_FAMILIES: Record<string, PageRuleItem> = {
	"font-sans": {
		style: 'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
	},
	"font-serif": {
		style: 'font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;',
	},
	"font-mono": {
		style: 'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
	},
};

// Font Sizes & Default Line Heights
const FONT_SIZES: Record<string, PageRuleItem> = {
	"text-xs": { style: "font-size: 0.75rem; line-height: 1rem;" },
	"text-sm": { style: "font-size: 0.875rem; line-height: 1.25rem;" },
	"text-base": { style: "font-size: 1rem; line-height: 1.5rem;" },
	"text-lg": { style: "font-size: 1.125rem; line-height: 1.75rem;" },
	"text-xl": { style: "font-size: 1.25rem; line-height: 1.75rem;" },
	"text-2xl": { style: "font-size: 1.5rem; line-height: 2rem;" },
	"text-3xl": { style: "font-size: 1.875rem; line-height: 2.25rem;" },
	"text-4xl": { style: "font-size: 2.25rem; line-height: 2.5rem;" },
	"text-5xl": { style: "font-size: 3rem; line-height: 1;" },
	"text-6xl": { style: "font-size: 3.75rem; line-height: 1;" },
	"text-7xl": { style: "font-size: 4.5rem; line-height: 1;" },
	"text-8xl": { style: "font-size: 6rem; line-height: 1;" },
	"text-9xl": { style: "font-size: 8rem; line-height: 1;" },
};

// Font Weights
const FONT_WEIGHTS: Record<string, PageRuleItem> = {
	"font-thin": { style: "font-weight: 100;" },
	"font-extralight": { style: "font-weight: 200;" },
	"font-light": { style: "font-weight: 300;" },
	"font-normal": { style: "font-weight: 400;" },
	"font-medium": { style: "font-weight: 500;" },
	"font-semibold": { style: "font-weight: 600;" },
	"font-bold": { style: "font-weight: 700;" },
	"font-extrabold": { style: "font-weight: 800;" },
	"font-black": { style: "font-weight: 900;" },
};

// Font Styles & Text Transforms
const FONT_STYLES: Record<string, PageRuleItem> = {
	italic: { style: "font-style: italic;" },
	"not-italic": { style: "font-style: normal;" },
	uppercase: { style: "text-transform: uppercase;" },
	lowercase: { style: "text-transform: lowercase;" },
	capitalize: { style: "text-transform: capitalize;" },
	"normal-case": { style: "text-transform: none;" },
	underline: { style: "text-decoration-line: underline;" },
	"line-through": { style: "text-decoration-line: line-through;" },
	"no-underline": { style: "text-decoration-line: none;" },
};

// ============================================================================
// COLOR
// ============================================================================

const STATIC_COLORS: Record<string, string> = {
	transparent: "transparent",
	current: "currentColor",
	black: "#000000",
	white: "#ffffff",
};

// Essential Document Color Palette (Tailwind Scale)
const COLOR_PALETTE: Record<string, Record<string, string>> = {
	slate: {
		50: "#f8fafc",
		100: "#f1f5f9",
		200: "#e2e8f0",
		300: "#cbd5e1",
		400: "#94a3b8",
		500: "#64748b",
		600: "#475569",
		700: "#334155",
		800: "#1e293b",
		900: "#0f172a",
	},
	gray: {
		50: "#f9fafb",
		100: "#f3f4f6",
		200: "#e5e7eb",
		300: "#d1d5db",
		400: "#9ca3af",
		500: "#6b7280",
		600: "#4b5563",
		700: "#374151",
		800: "#1f2937",
		900: "#111827",
	},
	zinc: {
		50: "#fafafa",
		100: "#f4f4f5",
		200: "#e4e4e7",
		300: "#d4d4d8",
		400: "#a1a1aa",
		500: "#71717a",
		600: "#52525b",
		700: "#3f3f46",
		800: "#27272a",
		900: "#18181b",
	},
	neutral: {
		50: "#fafafa",
		100: "#f5f5f5",
		200: "#e5e5e5",
		300: "#d4d4d4",
		400: "#a3a3a3",
		500: "#737373",
		600: "#525252",
		700: "#404040",
		800: "#262626",
		900: "#171717",
	},
	stone: {
		50: "#fafaf9",
		100: "#f5f5f4",
		200: "#e7e5e4",
		300: "#d6d3d1",
		400: "#a8a29e",
		500: "#78716c",
		600: "#57534e",
		700: "#44403c",
		800: "#292524",
		900: "#1c1917",
	},
	red: {
		50: "#fef2f2",
		100: "#fee2e2",
		200: "#fecaca",
		300: "#fca5a5",
		400: "#f87171",
		500: "#ef4444",
		600: "#dc2626",
		700: "#b91c1c",
		800: "#991b1b",
		900: "#7f1d1d",
	},
	orange: {
		50: "#fff7ed",
		100: "#ffedd5",
		200: "#fed7aa",
		300: "#fdba74",
		400: "#fb923c",
		500: "#f97316",
		600: "#ea580c",
		700: "#c2410c",
		800: "#9a3412",
		900: "#7c2d12",
	},
	amber: {
		50: "#fffbeb",
		100: "#fef3c7",
		200: "#fde68a",
		300: "#fcd34d",
		400: "#fbbf24",
		500: "#f59e0b",
		600: "#d97706",
		700: "#b45309",
		800: "#92400e",
		900: "#78350f",
	},
	yellow: {
		50: "#fefce8",
		100: "#fef9c3",
		200: "#fef08a",
		300: "#fde047",
		400: "#facc15",
		500: "#eab308",
		600: "#ca8a04",
		700: "#a16207",
		800: "#854d0e",
		900: "#713f12",
	},
	lime: {
		50: "#f7fee7",
		100: "#ecfccb",
		200: "#d9f99d",
		300: "#bef264",
		400: "#a3e635",
		500: "#84cc16",
		600: "#65a30d",
		700: "#4d7c0f",
		800: "#3f6212",
		900: "#365314",
	},
	green: {
		50: "#f0fdf4",
		100: "#dcfce7",
		200: "#bbf7d0",
		300: "#86efac",
		400: "#4ade80",
		500: "#22c55e",
		600: "#16a34a",
		700: "#15803d",
		800: "#166534",
		900: "#14532d",
	},
	emerald: {
		50: "#ecfdf5",
		100: "#d1fae5",
		200: "#a7f3d0",
		300: "#6ee7b7",
		400: "#34d399",
		500: "#10b981",
		600: "#059669",
		700: "#047857",
		800: "#065f46",
		900: "#064e3b",
	},
	teal: {
		50: "#f0fdfa",
		100: "#ccfbf1",
		200: "#99f6e4",
		300: "#5eead4",
		400: "#2dd4bf",
		500: "#14b8a6",
		600: "#0d9488",
		700: "#0f766e",
		800: "#115e59",
		900: "#134e4a",
	},
	cyan: {
		50: "#ecfeff",
		100: "#cffaff",
		200: "#a5f3fc",
		300: "#67e8f9",
		400: "#22d3ee",
		500: "#06b6d4",
		600: "#0891b2",
		700: "#0e7490",
		800: "#155e75",
		900: "#164e63",
	},
	sky: {
		50: "#f0f9ff",
		100: "#e0f2fe",
		200: "#bae6fd",
		300: "#7dd3fc",
		400: "#38bdf8",
		500: "#0ea5e9",
		600: "#0284c7",
		700: "#0369a1",
		800: "#075985",
		900: "#0c4a6e",
	},
	blue: {
		50: "#eff6ff",
		100: "#dbeafe",
		200: "#bfdbfe",
		300: "#93c5fd",
		400: "#60a5fa",
		500: "#3b82f6",
		600: "#2563eb",
		700: "#1d4ed8",
		800: "#1e40af",
		900: "#1e3a8a",
	},
	indigo: {
		50: "#eef2ff",
		100: "#e0e7ff",
		200: "#c7d2fe",
		300: "#a5b4fc",
		400: "#818cf8",
		500: "#6366f1",
		600: "#4f46e5",
		700: "#4338ca",
		800: "#3730a3",
		900: "#312e81",
	},
	violet: {
		50: "#f5f3ff",
		100: "#ede9fe",
		200: "#ddd6fe",
		300: "#c4b5fd",
		400: "#a78bfa",
		500: "#8b5cf6",
		600: "#7c3aed",
		700: "#6d28d9",
		800: "#5b21b6",
		900: "#4c1d95",
	},
	purple: {
		50: "#faf5ff",
		100: "#f3e8ff",
		200: "#e9d5ff",
		300: "#d8b4fe",
		400: "#c084fc",
		500: "#a855f7",
		600: "#9333ea",
		700: "#7e22ce",
		800: "#6b21a8",
		900: "#581c87",
	},
	fuchsia: {
		50: "#fdf4ff",
		100: "#fae8ff",
		200: "#f5d0fe",
		300: "#f0abfc",
		400: "#e879f9",
		500: "#d946ef",
		600: "#c026d3",
		700: "#a21caf",
		800: "#86198f",
		900: "#701a75",
	},
	pink: {
		50: "#fdf2f8",
		100: "#fce7f3",
		200: "#fbcfe8",
		300: "#f9a8d4",
		400: "#f472b6",
		500: "#ec4899",
		600: "#db2777",
		700: "#be185d",
		800: "#9d174d",
		900: "#831843",
	},
	rose: {
		50: "#fff1f2",
		100: "#ffe4e6",
		200: "#fecdd3",
		300: "#fda4af",
		400: "#fb7185",
		500: "#f43f5e",
		600: "#e11d48",
		700: "#be123c",
		800: "#9f1239",
		900: "#881337",
	},
};

/** Generates bg-*, text-*, and border-* color classes */
function createColorRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {};

	const registerColor = (key: string, value: string) => {
		rules[`bg-${key}`] = { style: `background-color: ${value};` };
		rules[`text-${key}`] = { style: `color: ${value};` };
		rules[`border-${key}`] = { style: `border-color: ${value};` };
	};

	// Base colors (bg-white, text-black, etc.)
	for (const [key, val] of Object.entries(STATIC_COLORS)) {
		registerColor(key, val);
	}

	// Palette colors (bg-gray-100, text-slate-800, etc.)
	for (const [group, shades] of Object.entries(COLOR_PALETTE)) {
		for (const [shade, val] of Object.entries(shades)) {
			registerColor(`${group}-${shade}`, val);
		}

		// Alias base group name (e.g. "red") to shade "500" if present
		if (shades["500"]) {
			registerColor(group, shades["500"]);
		}
	}

	return rules;
}

// ============================================================================
// OPACITY
// ============================================================================

const OPACITY_SCALE: Record<string, string> = {
	"0": "0",
	"5": "0.05",
	"10": "0.1",
	"20": "0.2",
	"25": "0.25",
	"30": "0.3",
	"40": "0.4",
	"50": "0.5",
	"60": "0.6",
	"70": "0.7",
	"75": "0.75",
	"80": "0.8",
	"90": "0.9",
	"95": "0.95",
	"100": "1",
};

/** Generates standard opacity utilities (opacity-0, opacity-50, etc.) */
function createOpacityRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {};
	for (const [key, val] of Object.entries(OPACITY_SCALE)) {
		rules[`opacity-${key}`] = { style: `opacity: ${val};` };
	}
	return rules;
}

// ============================================================================
// SHADOW
// ============================================================================

const SHADOW_RULES: Record<string, PageRuleItem> = {
	"shadow-xs": {
		style: "box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);",
	},
	shadow: {
		style: "box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);",
	},
	"shadow-md": {
		style: "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);",
	},
	"shadow-lg": {
		style: "box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);",
	},
	"shadow-xl": {
		style: "box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);",
	},
	"shadow-2xl": {
		style: "box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);",
	},
	"shadow-inner": {
		style: "box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);",
	},
	"shadow-none": {
		style: "box-shadow: none;",
	},
};

// ============================================================================
// GRID FLEX
// ============================================================================

/** Static Flexbox and Grid alignment and structural rules */
const STATIC_FLEX_GRID_RULES: Record<string, PageRuleItem> = {
	// Display
	flex: { style: "display: flex;" },
	"inline-flex": { style: "display: inline-flex;" },
	grid: { style: "display: grid;" },
	"inline-grid": { style: "display: inline-grid;" },

	// Flex Direction
	"flex-row": { style: "flex-direction: row;" },
	"flex-row-reverse": { style: "flex-direction: row-reverse;" },
	"flex-col": { style: "flex-direction: column;" },
	"flex-col-reverse": { style: "flex-direction: column-reverse;" },

	// Flex Wrap
	"flex-wrap": { style: "flex-wrap: wrap;" },
	"flex-wrap-reverse": { style: "flex-wrap: wrap-reverse;" },
	"flex-nowrap": { style: "flex-wrap: nowrap;" },

	// Flex Sizing & Resizing
	"flex-1": { style: "flex: 1 1 0%;" },
	"flex-auto": { style: "flex: 1 1 auto;" },
	"flex-initial": { style: "flex: 0 1 auto;" },
	"flex-none": { style: "flex: none;" },
	grow: { style: "flex-grow: 1;" },
	"grow-0": { style: "flex-grow: 0;" },
	shrink: { style: "flex-shrink: 1;" },
	"shrink-0": { style: "flex-shrink: 0;" },

	// Align Items
	"items-start": { style: "align-items: flex-start;" },
	"items-end": { style: "align-items: flex-end;" },
	"items-center": { style: "align-items: center;" },
	"items-baseline": { style: "align-items: baseline;" },
	"items-stretch": { style: "align-items: stretch;" },

	// Justify Content
	"justify-start": { style: "justify-content: flex-start;" },
	"justify-end": { style: "justify-content: flex-end;" },
	"justify-center": { style: "justify-content: center;" },
	"justify-between": { style: "justify-content: space-between;" },
	"justify-around": { style: "justify-content: space-around;" },
	"justify-evenly": { style: "justify-content: space-evenly;" },

	// Align Self
	"self-auto": { style: "align-self: auto;" },
	"self-start": { style: "align-self: flex-start;" },
	"self-end": { style: "align-self: flex-end;" },
	"self-center": { style: "align-self: center;" },
	"self-stretch": { style: "align-self: stretch;" },

	// Grid Defaults
	"grid-cols-none": { style: "grid-template-columns: none;" },
	"grid-rows-none": { style: "grid-template-rows: none;" },
	"col-auto": { style: "grid-column: auto;" },
	"row-auto": { style: "grid-row: auto;" },
	"col-span-full": { style: "grid-column: 1 / -1;" },
	"row-span-full": { style: "grid-row: 1 / -1;" },
};

/** Programmatically generates grid columns, rows, and span utilities */
function createFlexGridRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = { ...STATIC_FLEX_GRID_RULES };

	// Generate grid-cols-1 through grid-cols-12
	for (let i = 1; i <= 12; i++) {
		rules[`grid-cols-${i}`] = {
			style: `grid-template-columns: repeat(${i}, minmax(0, 1fr));`,
		};
		rules[`col-span-${i}`] = {
			style: `grid-column: span ${i} / span ${i};`,
		};
	}

	// Generate grid-rows-1 through grid-rows-6
	for (let i = 1; i <= 6; i++) {
		rules[`grid-rows-${i}`] = {
			style: `grid-template-rows: repeat(${i}, minmax(0, 1fr));`,
		};
		rules[`row-span-${i}`] = {
			style: `grid-row: span ${i} / span ${i};`,
		};
	}

	return rules;
}

// ============================================================================
// POSITIONING, INSET, Z-INDEX
// ============================================================================

const POSITION_DISPLAY: Record<string, PageRuleItem> = {
	static: { style: "position: static;" },
	fixed: { style: "position: fixed;" },
	absolute: { style: "position: absolute;" },
	relative: { style: "position: relative;" },
	sticky: { style: "position: sticky;" },
};

const Z_INDEX_PRESETS: Record<string, PageRuleItem> = {
	"z-0": { style: "z-index: 0;" },
	"z-10": { style: "z-index: 10;" },
	"z-20": { style: "z-index: 20;" },
	"z-30": { style: "z-index: 30;" },
	"z-40": { style: "z-index: 40;" },
	"z-50": { style: "z-index: 50;" },
	"z-auto": { style: "z-index: auto;" },
};

// Inset spacing scale lookup (in rem/percentage)
const INSET_SCALE: Record<string, string> = {
	...SPACING_SCALE,
	full: "100%",
	auto: "auto",
};

/** Programmatically generates top, right, bottom, left, and inset utilities */
function createPositionRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = {
		...POSITION_DISPLAY,
		...Z_INDEX_PRESETS,
	};

	// Full coverage inset aliases (inset-0, inset-x-0, inset-y-0)
	for (const [key, val] of Object.entries(INSET_SCALE)) {
		rules[`inset-${key}`] = {
			style: `top: ${val}; right: ${val}; bottom: ${val}; left: ${val};`,
		};
		rules[`inset-x-${key}`] = { style: `left: ${val}; right: ${val};` };
		rules[`inset-y-${key}`] = { style: `top: ${val}; bottom: ${val};` };
		rules[`top-${key}`] = { style: `top: ${val};` };
		rules[`right-${key}`] = { style: `right: ${val};` };
		rules[`bottom-${key}`] = { style: `bottom: ${val};` };
		rules[`left-${key}`] = { style: `left: ${val};` };
	}

	return rules;
}

// ============================================================================
// PAGE BREAK
// ============================================================================

const PAGE_BREAK_RULES: Record<string, PageRuleItem> = {
	// Prevent or allow breaks INSIDE an element (e.g. table rows, cards, signatures)
	"break-inside-auto": {
		style: "break-inside: auto; page-break-inside: auto;",
	},
	"break-inside-avoid": {
		style: "break-inside: avoid; page-break-inside: avoid;",
	},
	"break-inside-avoid-page": {
		style: "break-inside: avoid-page; page-break-inside: avoid;",
	},

	// Force or prevent page breaks BEFORE an element
	"break-before-auto": {
		style: "break-before: auto; page-break-before: auto;",
	},
	"break-before-avoid": {
		style: "break-before: avoid; page-break-before: avoid;",
	},
	"break-before-page": {
		style: "break-before: page; page-break-before: always;",
	},
	"break-before-always": {
		style: "break-before: always; page-break-before: always;",
	},
	"break-before-left": {
		style: "break-before: left; page-break-before: left;",
	},
	"break-before-right": {
		style: "break-before: right; page-break-before: right;",
	},

	// Force or prevent page breaks AFTER an element
	"break-after-auto": {
		style: "break-after: auto; page-break-after: auto;",
	},
	"break-after-avoid": {
		style: "break-after: avoid; page-break-after: avoid;",
	},
	"break-after-page": {
		style: "break-after: page; page-break-after: always;",
	},
	"break-after-always": {
		style: "break-after: always; page-break-after: always;",
	},
	"break-after-left": {
		style: "break-after: left; page-break-after: left;",
	},
	"break-after-right": {
		style: "break-after: right; page-break-after: right;",
	},
};

// ============================================================================
// TRANSFORM
// ============================================================================

const ROTATE_PRESETS: Record<string, string> = {
	"0": "0deg",
	"1": "1deg",
	"2": "2deg",
	"3": "3deg",
	"6": "6deg",
	"12": "12deg",
	"45": "45deg",
	"90": "90deg",
	"180": "180deg",
};

const SCALE_PRESETS: Record<string, string> = {
	"0": "0",
	"50": "0.5",
	"75": "0.75",
	"90": "0.9",
	"95": "0.95",
	"100": "1",
	"105": "1.05",
	"110": "1.1",
	"125": "1.25",
	"150": "1.5",
};

const TRANSLATE_SCALE: Record<string, string> = {
	...SPACING_SCALE,
	...FRACTION_SCALE,
};

const TRANSFORM_ORIGINS: Record<string, PageRuleItem> = {
	"origin-center": { style: "transform-origin: center;" },
	"origin-top": { style: "transform-origin: top;" },
	"origin-top-right": { style: "transform-origin: top right;" },
	"origin-right": { style: "transform-origin: right;" },
	"origin-bottom-right": { style: "transform-origin: bottom right;" },
	"origin-bottom": { style: "transform-origin: bottom;" },
	"origin-bottom-left": { style: "transform-origin: bottom left;" },
	"origin-left": { style: "transform-origin: left;" },
	"origin-top-left": { style: "transform-origin: top left;" },
};

/** Programmatically generates rotate, scale, translate, and transform-origin utilities */
function createTransformRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = { ...TRANSFORM_ORIGINS };

	// 1. Rotation (rotate-12, -rotate-12, rotate-45)
	for (const [key, val] of Object.entries(ROTATE_PRESETS)) {
		rules[`rotate-${key}`] = {
			style: `rotate: ${val}; transform: rotate(${val});`,
		};
		if (key !== "0") {
			rules[`-rotate-${key}`] = {
				style: `rotate: -${val}; transform: rotate(-${val});`,
			};
		}
	}

	// 2. Scale (scale-95, scale-x-105, scale-y-90)
	for (const [key, val] of Object.entries(SCALE_PRESETS)) {
		rules[`scale-${key}`] = {
			style: `scale: ${val}; transform: scale(${val});`,
		};
		rules[`scale-x-${key}`] = {
			style: `scale: ${val} 1; transform: scaleX(${val});`,
		};
		rules[`scale-y-${key}`] = {
			style: `scale: 1 ${val}; transform: scaleY(${val});`,
		};
	}

	// 3. Translation (translate-x-2, -translate-x-2, translate-y-1/2, -translate-y-1/2)
	for (const [key, val] of Object.entries(TRANSLATE_SCALE)) {
		rules[`translate-x-${key}`] = {
			style: `translate: ${val} 0; transform: translateX(${val});`,
		};
		rules[`translate-y-${key}`] = {
			style: `translate: 0 ${val}; transform: translateY(${val});`,
		};

		if (key !== "0") {
			rules[`-translate-x-${key}`] = {
				style: `translate: -${val} 0; transform: translateX(-${val});`,
			};
			rules[`-translate-y-${key}`] = {
				style: `translate: 0 -${val}; transform: translateY(-${val});`,
			};
		}
	}

	return rules;
}

// ============================================================================
// TABLE
// ============================================================================

const TABLE_RULES: Record<string, PageRuleItem> = Object.freeze({
	// Table Layout
	"table-auto": { style: "table-layout: auto;" },
	"table-fixed": { style: "table-layout: fixed;" },

	// Border Collapse
	"border-collapse": { style: "border-collapse: collapse;" },
	"border-separate": { style: "border-collapse: separate;" },

	// Table Display Types
	table: { style: "display: table;" },
	"inline-table": { style: "display: inline-table;" },
	"table-row-group": { style: "display: table-row-group;" },
	"table-header-group": { style: "display: table-header-group;" },
	"table-footer-group": { style: "display: table-footer-group;" },
	"table-row": { style: "display: table-row;" },
	"table-cell": { style: "display: table-cell;" },
	"table-caption": { style: "display: table-caption;" },
	"table-column": { style: "display: table-column;" },
	"table-column-group": { style: "display: table-column-group;" },

	// Vertical Alignment for Table Cells
	"align-baseline": { style: "vertical-align: baseline;" },
	"align-top": { style: "vertical-align: top;" },
	"align-middle": { style: "vertical-align: middle;" },
	"align-bottom": { style: "vertical-align: bottom;" },
	"align-text-top": { style: "vertical-align: text-top;" },
	"align-text-bottom": { style: "vertical-align: text-bottom;" },

	// Preset Zebra Striping Component Rule
	"table-striped": { style: "width: 100%; border-collapse: collapse;" },
});

const BORDER_SPACING_SCALE: Record<string, string> = {
	"0": "0px",
	"1": "1px",
	"2": "2px",
	"4": "4px",
	"8": "8px",
};

/** Programmatically generates table layout and border-spacing utilities */
function createTableRules(): Record<string, PageRuleItem> {
	const rules: Record<string, PageRuleItem> = { ...TABLE_RULES };

	// Generate border-spacing presets (e.g., border-spacing-2, border-spacing-x-4)
	for (const [key, val] of Object.entries(BORDER_SPACING_SCALE)) {
		rules[`border-spacing-${key}`] = { style: `border-spacing: ${val};` };
		rules[`border-spacing-x-${key}`] = {
			style: `border-spacing: ${val} 0px;`,
		};
		rules[`border-spacing-y-${key}`] = {
			style: `border-spacing: 0px ${val};`,
		};
	}

	return rules;
}

// ============================================================================
// TYPOGRAPHY
// ============================================================================

const TRACKING_RULES: Record<string, PageRuleItem> = {
	"tracking-tighter": { style: "letter-spacing: -0.05em;" },
	"tracking-tight": { style: "letter-spacing: -0.025em;" },
	"tracking-normal": { style: "letter-spacing: 0em;" },
	"tracking-wide": { style: "letter-spacing: 0.025em;" },
	"tracking-wider": { style: "letter-spacing: 0.05em;" },
	"tracking-widest": { style: "letter-spacing: 0.1em;" },
};

const LEADING_RULES: Record<string, PageRuleItem> = {
	"leading-none": { style: "line-height: 1;" },
	"leading-tight": { style: "line-height: 1.25;" },
	"leading-snug": { style: "line-height: 1.375;" },
	"leading-normal": { style: "line-height: 1.5;" },
	"leading-relaxed": { style: "line-height: 1.625;" },
	"leading-loose": { style: "line-height: 2;" },

	// Fixed unit line heights for tight data alignments
	"leading-3": { style: "line-height: .75rem;" },
	"leading-4": { style: "line-height: 1rem;" },
	"leading-5": { style: "line-height: 1.25rem;" },
	"leading-6": { style: "line-height: 1.5rem;" },
	"leading-7": { style: "line-height: 1.75rem;" },
	"leading-8": { style: "line-height: 2rem;" },
};

const TRUNCATION_RULES: Record<string, PageRuleItem> = {
	// Single-line truncation
	truncate: {
		style: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
	},
	"text-ellipsis": { style: "text-overflow: ellipsis;" },
	"text-clip": { style: "text-overflow: clip;" },

	// Whitespace management
	"whitespace-normal": { style: "white-space: normal;" },
	"whitespace-nowrap": { style: "white-space: nowrap;" },
	"whitespace-pre": { style: "white-space: pre;" },
	"whitespace-pre-line": { style: "white-space: pre-line;" },
	"whitespace-pre-wrap": { style: "white-space: pre-wrap;" },

	// Preset Multi-line Clamp Rules
	"line-clamp-none": {
		style: "overflow: visible; display: block; -webkit-box-orient: horizontal; -webkit-line-clamp: none;",
	},
	"line-clamp-1": {
		style: "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;",
	},
	"line-clamp-2": {
		style: "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;",
	},
	"line-clamp-3": {
		style: "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;",
	},
};

// ============================================================================
// BACKGROUND
// ============================================================================
const BACKGROUND_RULES: Record<string, PageRuleItem> = {
	// attachment
	"bg-fixed": { style: "background-attachment: fixed;" },
	"bg-local": { style: "background-attachment: local;" },
	"bg-scroll": { style: "background-attachment: scroll;" },

	// clip
	"bg-clip-border": { style: "background-clip: border-box;" },
	"bg-clip-padding": { style: "background-clip: padding-box;" },
	"bg-clip-content": { style: "background-clip: content-box;" },
	"bg-clip-text": { style: "background-clip: text;" },

	// origin
	"bg-origin-border": { style: "background-origin: border-box;" },
	"bg-origin-padding": { style: "background-origin: padding-box;" },
	"bg-origin-content": { style: "background-origin: content-box;" },

	// position
	"bg-top-left": { style: "background-position: top left;" },
	"bg-top": { style: "background-position: top;" },
	"bg-top-right": { style: "background-position: top right;" },
	"bg-left": { style: "background-position: left;" },
	"bg-center": { style: "background-position: center;" },
	"bg-right": { style: "background-position: right;" },
	"bg-bottom-left": { style: "background-position: bottom left;" },
	"bg-bottom": { style: "background-position: bottom;" },
	"bg-bottom-right": { style: "background-position: bottom right;" },

	// repeat
	"bg-repeat": { style: "background-repeat: repeat;" },
	"bg-repeat-x": { style: "background-repeat: repeat-x;" },
	"bg-repeat-y": { style: "background-repeat: repeat-y;" },
	"bg-repeat-space": { style: "background-repeat: space;" },
	"bg-repeat-round": { style: "background-repeat: round;" },
	"bg-no-repeat": { style: "background-repeat: no-repeat;" },

	// size
	"bg-auto": { style: "background-size: auto;" },
	"bg-cover": { style: "background-size: cover;" },
	"bg-contain": { style: "background-size: contain;" },
};

// ============================================================================
// PAGE
// ============================================================================

function createPageRules(): Record<string, PageRuleItem | PageRuleItem[]> {
	const rules: Record<string, PageRuleItem | PageRuleItem[]> = {
		// Base Environment Setup
		page: [
			{
				style: tailwindReset,
			},
			{
				rule: "screen",
				style: pageScreenCSS,
			},
			{
				rule: "print",
				style: pagePrintCSS,
			},
		],
	};

	// Generate named @page rules and utility bindings for each paper preset
	for (const [key, dim] of Object.entries(PAGE_DIMENSIONS)) {
		const portraitPage = `page ${key}-portrait`;
		const landscapePage = `page ${key}-landscape`;

		// Portrait (e.g., .a4)
		rules[key] = [
			{
				rule: portraitPage,
				style: `size: ${dim.sizeName} portrait; margin: 0;`,
			},
			{ rule: "print", style: `page: ${key}-portrait;` },
			{ style: `width: ${dim.w}; min-height: ${dim.h};` },
		];

		// Landscape (e.g., .a4-landscape)
		rules[`${key}-landscape`] = [
			{
				rule: landscapePage,
				style: `size: ${dim.sizeName} landscape; margin: 0;`,
			},
			{ rule: "print", style: `page: ${key}-landscape;` },
			{ style: `width: ${dim.h}; min-height: ${dim.w};` },
		];
	}

	return rules;
}

// Convert page margins to box-sizing padding (identical rendering in Screen & Print)
const PAGE_MARGIN_RULES: Record<string, PageRuleItem> = {
	"page-m-0": { style: "padding: 0;" },
	"page-m-sm": { style: "padding: 5mm;" },
	"page-m-md": { style: "padding: 10mm;" },
	"page-m-lg": { style: "padding: 20mm;" },

	// Directional Presets
	"page-mt-0": { style: "padding-top: 0;" },
	"page-mb-0": { style: "padding-bottom: 0;" },
	"page-ml-0": { style: "padding-left: 0;" },
	"page-mr-0": { style: "padding-right: 0;" },
	"page-mx-0": { style: "padding-left: 0; padding-right: 0;" },
	"page-my-0": { style: "padding-top: 0; padding-bottom: 0;" },
};

// ============================================================================
// FINAL RULES DICTIONARY
// ============================================================================

export const rules: Record<string, PageRuleItem | PageRuleItem[]> =
	Object.freeze({
		...SHADOW_RULES,
		...BACKGROUND_RULES,
		...PAGE_BREAK_RULES,
		...PAGE_MARGIN_RULES,
		...FONT_FAMILIES,
		...FONT_SIZES,
		...FONT_WEIGHTS,
		...FONT_STYLES,
		...TEXT_ALIGN,
		...TRACKING_RULES,
		...LEADING_RULES,
		...TRUNCATION_RULES,
		...LAYOUT_RULES,
		...createSizingRules(),
		...createBorderRules(),
		...createSpacingRules(),
		...createGapRules(),
		...createColorRules(),
		...createOpacityRules(),
		...createFlexGridRules(),
		...createPositionRules(),
		...createTransformRules(),
		...createTableRules(),
		...createPageRules(),
	});

// ============================================================================
// ANOTHER EXPORT
// ============================================================================

/** Maps class prefixes (e.g. "p", "min-h", "gap") to standard CSS properties */
export const ARBITRARY_PROPERTIES: Record<string, string[]> = Object.freeze({
	// Padding & Margin — reuses SPACING_DIRECTIONS instead of re-listing
	// the same prefix → CSS-property mapping a second time.
	...SPACING_DIRECTIONS,

	// Layout & Sizing
	gap: ["gap"],
	"gap-x": ["column-gap"],
	"gap-y": ["row-gap"],
	w: ["width"],
	h: ["height"],
	"min-w": ["min-width"],
	"max-w": ["max-width"],
	"min-h": ["min-height"],
	"max-h": ["max-height"],

	// Borders & Radius
	rounded: ["border-radius"],
	border: ["border-width"],

	// Typography details
	leading: ["line-height"], // e.g. leading-[1.6] or leading-[24px]
	tracking: ["letter-spacing"], // e.g. tracking-[0.05em] or tracking-[1px]
});

/**
 * Flat lookup map of all base color names -> hex values. Generated from
 * STATIC_COLORS + COLOR_PALETTE (the same single source of truth used by
 * createColorRules()) instead of being hand-curated, which had let it drift
 * out of sync — e.g. "current", "amber", and "green" shades were defined
 * above but missing from this map even though bg/text/border rules exist
 * for them.
 */
export const ALL_COLORS: Record<string, string> = Object.freeze({
	...STATIC_COLORS,
	...Object.fromEntries(
		Object.entries(COLOR_PALETTE).flatMap(([group, shades]) =>
			Object.entries(shades).map(([shade, val]) => [
				`${group}-${shade}`,
				val,
			]),
		),
	),
});

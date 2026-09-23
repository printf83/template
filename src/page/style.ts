import type { Data, SchemaItem } from "../type/data";
import type { PageRuleItem } from "../type/style";
import { ALL_COLORS, ARBITRARY_PROPERTIES, rules } from "./rules";

// Pre-compiled Regular Expressions for high-performance parsing
const ESCAPE_REGEX = /([!#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g;
const CLASS_ATTR_REGEX = /class=(?:"([^"]*)"|'([^']*)')/g;
const ARBITRARY_CLASS_REGEX = /^(-?)([a-z]+(?:-[a-z]+)*)-\[(.+)\]$/;
const COLOR_OPACITY_REGEX = /^(bg|text|border)-(.+)\/(\d+|\[.+\])$/;
const VARIANT_CLASS_REGEX = /^(even|odd):(.+)$/;
const TEXT_SIZE_REGEX = /^[0-9.]+(px|pt|rem|em|mm|cm|in|%|vh|vw)?$/i;

const PROP_MAP: Record<string, string> = {
	bg: "background-color",
	text: "color",
	border: "border-color",
};

/** Converts 3 or 6 digit hex colors into rgba() strings */
function hexToRgba(hex: string, alpha: number): string {
	let cleanHex = hex.charCodeAt(0) === 35 ? hex.slice(1) : hex;

	if (cleanHex.length === 3) {
		cleanHex =
			cleanHex[0] +
			cleanHex[0] +
			cleanHex[1] +
			cleanHex[1] +
			cleanHex[2] +
			cleanHex[2];
	}

	if (cleanHex.length === 6) {
		const num = parseInt(cleanHex, 16);
		const r = (num >> 16) & 255;
		const g = (num >> 8) & 255;
		const b = num & 255;
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	return hex; // Fallback if already rgb/hsl
}

/** Escapes special CSS selector characters like [ and ] */
function escapeClassName(className: string): string {
	return className.replace(ESCAPE_REGEX, "\\$1");
}

/** Parses arbitrary classes like "p-[25px]" or "w-[50%]" */
function parseArbitraryClass<
	T extends readonly SchemaItem[],
	IsJson extends boolean = true,
>(
	className: string,
	data: Data<T, IsJson>,
): PageRuleItem | PageRuleItem[] | null {
	const match = className.match(ARBITRARY_CLASS_REGEX);
	if (!match) return null;

	const [, isNeg, prefix, rawValue] = match;
	const value = rawValue.replace(/_/g, " ");
	const sign = isNeg ? "-" : "";

	// 1. @page Margin Utilities (page-m-[10mm], page-mt-[15mm], page-mx-[1in])
	if (prefix.startsWith("page-m")) {
		const dir = prefix.slice(6); // Extracts "", "t", "r", "b", "l", "x", "y"
		switch (dir) {
			case "":
				return { style: `padding: ${value};` };
			case "t":
				return { style: `padding-top: ${value};` };
			case "r":
				return { style: `padding-right: ${value};` };
			case "b":
				return { style: `padding-bottom: ${value};` };
			case "l":
				return { style: `padding-left: ${value};` };
			case "x":
				return {
					style: `padding-left: ${value}; padding-right: ${value};`,
				};
			case "y":
				return {
					style: `padding-top: ${value}; padding-bottom: ${value};`,
				};
		}
	}

	// 2. Custom Page Dimensions (e.g., page-[210mm_297mm])
	if (prefix === "page") {
		const spaceIdx = value.indexOf(" ");
		if (spaceIdx !== -1) {
			const width = value.slice(0, spaceIdx);
			const height = value.slice(spaceIdx + 1);
			return [
				{ rule: "page", style: `size: ${value}; margin: 0;` },
				{ style: `width: ${width}; min-height: ${height};` },
			];
		}
		return { style: `width: ${value}; min-height: ${value};` };
	}

	// 3. Web Font Imports & Family Rules
	if (prefix === "font") {
		if (value.startsWith("url:")) {
			return {
				rule: "import",
				style: `@import url('${value.slice(4)}');`,
			};
		}
		const cleanedFont = value.replace(/['"]/g, "");
		return { style: `font-family: '${cleanedFont}', sans-serif;` };
	}

	// 4. Asset
	if (prefix === "asset") {
		if (data.asset && value in data.asset) {
			if (data.asset[value].startsWith("data:")) {
				return {
					style: `background-image: url("${data.asset[value]}")`,
				};
			}
		}
	}

	// 5. Standard Property Mappings
	switch (prefix) {
		case "bg-size":
			return { style: `background-size: ${value};` };
		case "bg-position":
			return { style: `background-position: ${value};` };
		case "tracking":
			return { style: `letter-spacing: ${value};` };
		case "leading":
			return { style: `line-height: ${value};` };
		case "line-clamp":
			return {
				style: `overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${value};`,
			};
		case "border-spacing":
			return { style: `border-spacing: ${value};` };
		case "border-spacing-x":
			return { style: `border-spacing: ${value} 0px;` };
		case "border-spacing-y":
			return { style: `border-spacing: 0px ${value};` };
		case "rotate":
			return {
				style: `rotate: ${sign}${value}; transform: rotate(${sign}${value});`,
			};
		case "scale":
			return {
				style: `scale: ${sign}${value}; transform: scale(${sign}${value});`,
			};
		case "translate-x":
			return {
				style: `translate: ${sign}${value} 0; transform: translateX(${sign}${value});`,
			};
		case "translate-y":
			return {
				style: `translate: 0 ${sign}${value}; transform: translateY(${sign}${value});`,
			};
		case "inset":
			return {
				style: `top: ${value}; right: ${value}; bottom: ${value}; left: ${value};`,
			};
		case "top":
		case "right":
		case "bottom":
		case "left":
			return { style: `${prefix}: ${sign}${value};` };
		case "z":
			return { style: `z-index: ${sign}${value};` };
		case "grid-cols":
			return { style: `grid-template-columns: ${value};` };
		case "flex":
			return { style: `flex: ${value};` };
		case "shadow":
			return { style: `box-shadow: ${value};` };
		case "opacity":
			return { style: `opacity: ${value};` };
		case "bg":
			return { style: `background-color: ${value};` };
		case "text": {
			const isSize = TEXT_SIZE_REGEX.test(value);
			return { style: `${isSize ? "font-size" : "color"}: ${value};` };
		}
	}

	const props = ARBITRARY_PROPERTIES[prefix];
	if (!props) return null;

	const style = props.map((prop) => `${prop}: ${value};`).join(" ");
	return { style };
}

/** Parses variant-prefixed classes like "even:bg-gray-50" or "odd:bg-[#f8fafc]" */
function parseVariantClass<
	T extends readonly SchemaItem[],
	IsJson extends boolean = true,
>(
	className: string,
	data: Data<T, IsJson>,
): { selector: string; style: string } | null {
	const match = className.match(VARIANT_CLASS_REGEX);
	if (!match) return null;

	const [, variant, baseClass] = match;

	let baseRule: PageRuleItem | PageRuleItem[] | null =
		(rules[baseClass] as PageRuleItem | PageRuleItem[]) || null;

	if (!baseRule) {
		baseRule = parseArbitraryClass(baseClass, data);
	}

	if (!baseRule) return null;

	const ruleItems = Array.isArray(baseRule) ? baseRule : [baseRule];

	const combinedStyle = ruleItems
		.filter((item) => !item.rule)
		.map((item) => item.style)
		.join(" ");

	if (!combinedStyle) return null;

	const escapedClass = escapeClassName(className);
	const nthChild = variant === "even" ? "nth-child(even)" : "nth-child(odd)";
	const selector = `.${escapedClass}:${nthChild}`;

	return { selector, style: combinedStyle };
}

/** Parses slash opacity classes like bg-black/10, text-gray-900/50, or bg-[#000]/20 */
function parseColorWithOpacity(className: string): PageRuleItem | null {
	const match = className.match(COLOR_OPACITY_REGEX);
	if (!match) return null;

	const [, prefix, colorPart, opacityPart] = match;

	let alpha = 1;
	if (
		opacityPart.charCodeAt(0) === 91 &&
		opacityPart.charCodeAt(opacityPart.length - 1) === 93
	) {
		alpha = parseFloat(opacityPart.slice(1, -1));
	} else {
		alpha = parseInt(opacityPart, 10) / 100;
	}

	if (isNaN(alpha)) return null;

	let hexColor = "";
	if (
		colorPart.charCodeAt(0) === 91 &&
		colorPart.charCodeAt(colorPart.length - 1) === 93
	) {
		hexColor = colorPart.slice(1, -1);
	} else if (colorPart in ALL_COLORS) {
		hexColor = ALL_COLORS[colorPart];
	} else {
		return null;
	}

	const rgbaColor = hexToRgba(hexColor, alpha);
	return { style: `${PROP_MAP[prefix]}: ${rgbaColor};` };
}

/** Main exported function */
export function style<
	T extends readonly SchemaItem[],
	IsJson extends boolean = true,
>(html: string, data: Data<T, IsJson>): string {
	const foundClasses = new Set<string>();

	CLASS_ATTR_REGEX.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = CLASS_ATTR_REGEX.exec(html)) !== null) {
		const classValue = match[1] || match[2] || "";
		if (!classValue) continue;

		const classList = classValue.trim().split(/\s+/);
		for (let i = 0; i < classList.length; i++) {
			if (classList[i]) foundClasses.add(classList[i]);
		}
	}

	const atRulesMap = new Map<string, Set<string>>();
	const classRulesSet = new Set<string>();

	const processItem = (
		className: string,
		item: PageRuleItem | PageRuleItem[],
	) => {
		const items = Array.isArray(item) ? item : [item];

		for (let i = 0; i < items.length; i++) {
			const singleItem = items[i];

			if (singleItem.rule) {
				if (!atRulesMap.has(singleItem.rule)) {
					atRulesMap.set(singleItem.rule, new Set());
				}

				const isDirectAtRule =
					singleItem.rule.startsWith("page") ||
					singleItem.rule === "import" ||
					((singleItem.rule === "screen" ||
						singleItem.rule === "print") &&
						singleItem.style.includes("{"));

				const ruleContent = isDirectAtRule
					? singleItem.style.trim()
					: `.${escapeClassName(className)} { ${singleItem.style} }`;

				atRulesMap.get(singleItem.rule)!.add(ruleContent);
			} else {
				classRulesSet.add(
					`.${escapeClassName(className)} { ${singleItem.style} }`,
				);
			}
		}
	};

	for (const className of foundClasses) {
		if (className in rules) {
			processItem(className, rules[className]);
		} else if (className.includes("/")) {
			const colorOpacityRule = parseColorWithOpacity(className);
			if (colorOpacityRule) {
				processItem(className, colorOpacityRule);
			}
		} else if (
			className.startsWith("even:") ||
			className.startsWith("odd:")
		) {
			const variantRule = parseVariantClass(className, data);
			if (variantRule) {
				classRulesSet.add(
					`${variantRule.selector} { ${variantRule.style} }`,
				);
			}
		} else {
			const dynamicRule = parseArbitraryClass(className, data);
			if (dynamicRule) {
				processItem(className, dynamicRule);
			}
		}
	}

	const output: string[] = [];

	// 1. Top-level @import directives
	if (atRulesMap.has("import")) {
		atRulesMap.get("import")!.forEach((imp) => output.push(imp));
		atRulesMap.delete("import");
	}

	// 2. Canonical print & screen block rules
	const CANONICAL_RULES = ["page", "screen", "print"];
	CANONICAL_RULES.forEach((ruleName) => {
		if (atRulesMap.has(ruleName)) {
			const combinedStyles = Array.from(atRulesMap.get(ruleName)!).join(
				"\n  ",
			);
			if (ruleName === "page") {
				output.push(`@page {\n  ${combinedStyles}\n}`);
			} else {
				output.push(`@media ${ruleName} {\n  ${combinedStyles}\n}`);
			}
			atRulesMap.delete(ruleName);
		}
	});

	// 3. Custom at-rules
	atRulesMap.forEach((styles, ruleName) => {
		const combinedStyles = Array.from(styles).join("\n  ");
		output.push(`@${ruleName} {\n  ${combinedStyles}\n}`);
	});

	// 4. Element class rules
	classRulesSet.forEach((rule) => output.push(rule));

	return output.join("\n\n");
}

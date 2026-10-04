import type { Data, SchemaItem } from "../type/data.d";
import { html } from "./html";
import { style } from "./style";
import systemStyle from "../assets/system.css?raw";
import systemScript from "../assets/system.js?raw";
import systemHtml from "../assets/system.html?raw";

/**
 * Minifies HTML by stripping CRLF, tabs, extra spaces, and whitespace between tags.
 */
export function minifies(html: string): string {
	return html
		.replace(/[\r\n\t]+/g, "") // 1. Remove all carriage returns, newlines, and tabs
		.replace(/>\s+</g, "><") // 2. Remove all whitespace between HTML tags
		.replace(/\s{2,}/g, " ") // 3. Collapse multiple consecutive spaces into a single space
		.trim(); // 4. Trim leading and trailing whitespace
}

export function render<T extends readonly SchemaItem[]>(
	data: Data<T> | null,
): {
	html?: string;
	style?: string;
	script?: string;
} {
	if (!data) return {};

	const generatedHtml = html(data);

	const finalHtml = [generatedHtml, systemHtml].filter(Boolean).join("\n");

	const generatedStyle = style(generatedHtml, data);
	const userStyle = data.style ?? "";

	// Concatenate generated atomic classes with custom user CSS
	const finalStyle = [generatedStyle, userStyle, systemStyle]
		.filter(Boolean)
		.join("\n");

	const userScript = data.script ?? "";
	const finalScript = [userScript, systemScript].filter(Boolean).join("\n");

	return {
		html: finalHtml,
		style: finalStyle,
		script: finalScript,
	};
}

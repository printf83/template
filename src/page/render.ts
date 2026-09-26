import type { Data, SchemaItem } from "../type/data.d";
import { html } from "./html";
import { style } from "./style";

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

	const systemStyle = `
	@media screen {
		body {
			/* tan(atan2(100vw, 1200px)) calculates (100vw / 1200px) as a unitless number */
			--scale: clamp(0.5, tan(atan2(100vw, 1200px)), 1);

			transform: scale(var(--scale));
			transform-origin: top center;

			/* Now calc() can safely subtract unitless numbers */
			margin-bottom: calc((1 - var(--scale)) * -100%);
		}
	}
	`;

	const systemScript = `
	document.addEventListener("DOMContentLoaded", () => {
        document.addEventListener("mouseover", (event) => {
            const page = event.target.closest(".page");
            if (page && !page.contains(event.relatedTarget)) {
                page.classList.add("page-hovered");
                console.log("Hover ENTER .page");
            }
        });

        document.addEventListener("mouseout", (event) => {
            const page = event.target.closest(".page");
            if (page && !page.contains(event.relatedTarget)) {
                page.classList.remove("page-hovered");
                console.log("Hover LEAVE .page", page);
            }
        });
	});
	`;

	const generatedHtml = html(data);

	const generatedStyle = style(generatedHtml, data);
	const userStyle = data.style ?? "";

	// Concatenate generated atomic classes with custom user CSS
	const finalStyle = [generatedStyle, userStyle, systemStyle]
		.filter(Boolean)
		.join("\n");

	const userScript = data.script ?? "";
	const finalScript = [userScript, systemScript].filter(Boolean).join("\n");

	return {
		html: generatedHtml,
		style: finalStyle,
		script: finalScript,
	};
}

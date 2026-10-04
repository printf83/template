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
			--scale: clamp(0.5, tan(atan2(100vw, 1000px)), 1);
			transform: scale(var(--scale));
			transform-origin: top center;
			margin-bottom: calc((1 - var(--scale)) * -100%);
		}
	}
	
	
	`;
	// PAGE CONTROL CSS
	// #pageControlContainer {
	// 	display: none;
	// 	position: fixed;
	// 	z-index: 9999;
	// 	display: none;
	// 	pointer-events: auto;
	// }

	// #pageControlContainer .page-control-body {
	// 	padding: 0.25rem 0.5rem;
	// 	display: flex;
	// 	flex: col;
	// 	gap: 0.25rem;
	// }

	// @meida print {
	// 	#pageControlContainer {
	// 		display: none !important;
	// 	}
	// }

	const systemScript = "";
	// const systemScript = `
	// document.addEventListener("DOMContentLoaded", () => {
	// 	const pageControlContainer = document.getElementById("pageControlContainer");
	// 	if (!pageControlContainer) return;

	// 	pageControlContainer.addEventListener("mouseenter", () => {
	// 		pageControlContainer.style.display = "inline-block";
	// 	});

	// 	document.addEventListener("mouseover", (event) => {
	// 		const page = event.target.closest(".page");

	// 		if (page && !page.contains(event.relatedTarget)) {
	// 			page.classList.add("page-hovered");

	// 			const rect = page.getBoundingClientRect();

	// 			pageControlContainer.style.top = (rect.top + window.pageYOffset) + "px";
	// 			pageControlContainer.style.left = (rect.left + window.pageXOffset) + "px";
	// 			pageControlContainer.style.display = "inline-block";
	// 		}
	// 	});

	// 	document.addEventListener("mouseout", (event) => {
	// 		const page = event.target.closest(".page");

	// 		if (page && !page.contains(event.relatedTarget)) {
	// 			if (!pageControlContainer.contains(event.relatedTarget)) {
	// 				page.classList.remove("page-hovered");
	// 				pageControlContainer.style.display = null;
	// 			}
	// 		}
	// 	});
	// });
	// `;

	const systemHtml = ``;
	// const systemHtml = `
	// <div id="pageControlContainer">
	// 	<div class="page-control-body">
	// 		<div>Print</div> | <div>PDF</div>
	// 	</div>
	// </div>
	// `;

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

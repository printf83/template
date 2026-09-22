import { data } from "./script/data";
import { render } from "./script/render";
import "./style/main.css";

/**
 * Minifies HTML by stripping CRLF, tabs, extra spaces, and whitespace between tags.
 */
function minifiesOutput(html: string): string {
	return html
		.replace(/[\r\n\t]+/g, "") // 1. Remove all carriage returns, newlines, and tabs
		.replace(/>\s+</g, "><") // 2. Remove all whitespace between HTML tags
		.replace(/\s{2,}/g, " ") // 3. Collapse multiple consecutive spaces into a single space
		.trim(); // 4. Trim leading and trailing whitespace
}

document.addEventListener("DOMContentLoaded", () => {
	const iframe = document.getElementById(
		"iframe",
	) as HTMLIFrameElement | null;

	if (iframe) {
		const [html, style, script] = render(data);
		iframe.srcdoc = minifiesOutput(
			`<!DOCTYPE html><html><head>${style ? `<style>${style}</style>` : ``}</head><body>${html}${script ? `<script>${script}</script>` : ``}</body></html>`,
		);
	}
});

import { data } from "./script/data";
import { render } from "./script/render";
import "./style/main.css";

document.addEventListener("DOMContentLoaded", () => {
	const iframe = document.getElementById(
		"iframe",
	) as HTMLIFrameElement | null;

	if (iframe) {
		const [html, style, script] = render(data);
		iframe.srcdoc = `<!DOCTYPE html><html><head>${style ? `<style>${style}</style>` : ``}</head><body>${html}${script ? `<script>${script}</script>` : ``}</body></html>`;
	}
});

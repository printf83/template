import { data } from "./data/test_0001";
import { render, minifies } from "./page/render";
import { attachBtnPrintAll } from "./script/print";
import "./style/main.css";

document.addEventListener("DOMContentLoaded", () => {
	const iframe = document.getElementById(
		"iframe",
	) as HTMLIFrameElement | null;

	if (iframe) {
		const [html, style, script] = render(data);
		iframe.srcdoc = minifies(
			`<!DOCTYPE html><html><head>${style ? `<style>${style}</style>` : ``}</head><body>${html}${script ? `<script>${script}</script>` : ``}</body></html>`,
		);
	}

	const btnPrint = document.getElementById(
		"btnPrintAll",
	) as HTMLButtonElement;
	if (iframe && btnPrint) {
		attachBtnPrintAll(btnPrint, iframe);
	}
});

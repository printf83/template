import { renderIcons } from "./script/icon";
import { data } from "./data/test_0001";
import { render, minifies } from "./page/render";
import { attachBtnPrintAll } from "./script/print";
import "./style/main.css";
import { attachBtnDownloadPdf } from "./script/pdf";
import { createCodeEditor } from "./script/editor";

document.addEventListener("DOMContentLoaded", () => {
	renderIcons();

	const iframe = document.getElementById(
		"iframe",
	) as HTMLIFrameElement | null;

	if (iframe) {
		const { html, style, script } = render(data);
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

	const btnDownloadPdf = document.getElementById(
		"btnDownloadPdf",
	) as HTMLButtonElement;
	if (iframe && btnDownloadPdf) {
		attachBtnDownloadPdf(btnDownloadPdf, iframe);
	}

	const formMain = document.getElementById("formMain") as HTMLDivElement;
	const formEditor = document.getElementById("formEditor") as HTMLDivElement;
	const ctlMain = document.getElementById("ctlMain") as HTMLDivElement;
	const ctlEditor = document.getElementById("ctlEditor") as HTMLDivElement;
	const btnEditor = document.getElementById("btnEditor") as HTMLButtonElement;
	const btnEditorSave = document.getElementById(
		"btnEditorSave",
	) as HTMLButtonElement;

	if (
		formMain &&
		formEditor &&
		ctlMain &&
		ctlEditor &&
		btnEditor &&
		btnEditorSave
	) {
		btnEditor.addEventListener("click", () => {
			ctlMain.classList.add("hidden");
			ctlEditor.classList.remove("hidden");
			formMain.classList.add("hidden");
			formEditor.classList.remove("hidden");
		});
		btnEditorSave.addEventListener("click", () => {
			ctlEditor.classList.add("hidden");
			ctlMain.classList.remove("hidden");
			formEditor.classList.add("hidden");
			formMain.classList.remove("hidden");
		});
	}

	const dataEditor = document.getElementById("data-editor") as HTMLDivElement;
	if (dataEditor) {
		createCodeEditor({
			container: dataEditor,
			language: "json",
			onChange: (value) => {
				console.log({ dataEditor: value });
			},
		});
	}

	const htmlEditor = document.getElementById("html-editor") as HTMLDivElement;
	if (htmlEditor) {
		createCodeEditor({
			container: htmlEditor,
			language: "html",
			onChange: (value) => {
				console.log({ htmlEditor: value });
			},
		});
	}

	const styleEditor = document.getElementById(
		"style-editor",
	) as HTMLDivElement;
	if (styleEditor) {
		createCodeEditor({
			container: styleEditor,
			language: "css",
			onChange: (value) => {
				console.log({ styleEditor: value });
			},
		});
	}

	const scriptEditor = document.getElementById(
		"script-editor",
	) as HTMLDivElement;
	if (scriptEditor) {
		createCodeEditor({
			container: scriptEditor,
			language: "javascript",
			onChange: (value) => {
				console.log({ scriptEditor: value });
			},
		});
	}

	const assetEditor = document.getElementById(
		"asset-editor",
	) as HTMLDivElement;
	if (assetEditor) {
		createCodeEditor({
			container: assetEditor,
			language: "json",
			onChange: (value) => {
				console.log({ assetEditor: value });
			},
		});
	}

	const schemaEditor = document.getElementById(
		"schema-editor",
	) as HTMLDivElement;
	if (schemaEditor) {
		createCodeEditor({
			container: schemaEditor,
			language: "json",
			onChange: (value) => {
				console.log({ schemaEditor: value });
			},
		});
	}

	const shortEditor = document.getElementById(
		"short-editor",
	) as HTMLDivElement;
	if (shortEditor) {
		createCodeEditor({
			container: shortEditor,
			language: "json",
			onChange: (value) => {
				console.log({ shortEditor: value });
			},
		});
	}
});

import { renderIcons } from "./script/icon";
import { data } from "./data/test_0001";
import { render, minifies } from "./page/render";
import { attachBtnPrintAll } from "./script/print";
import "./style/main.css";
import { attachBtnDownloadPdf } from "./script/pdf";
import { getEditData, initEditor, setEditData } from "./script/edit";
import { attachCopyFile } from "./script/copy";
import { setCurrentData } from "./data/data";
import { attachDownloadFile } from "./script/download";
import { attachUploadFile } from "./script/upload";

document.addEventListener("DOMContentLoaded", () => {
	setCurrentData(data);

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

	const btnEditorReadFile = document.getElementById(
		"btnEditorReadFile",
	) as HTMLButtonElement;
	if (btnEditorReadFile) {
		attachCopyFile(btnEditorReadFile);
	}

	const btnEditorDownloadFile = document.getElementById(
		"btnEditorDownloadFile",
	) as HTMLButtonElement;
	if (btnEditorDownloadFile) {
		attachDownloadFile(btnEditorDownloadFile);
	}

	const btnEditorUploadFile = document.getElementById(
		"btnEditorUploadFile",
	) as HTMLButtonElement;
	if (btnEditorUploadFile) {
		attachUploadFile(btnEditorUploadFile);
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

			const d = getEditData();
			if (d) {
				Object.assign(data, d);
				setCurrentData(data);

				const { html, style, script } = render(data);
				if (iframe) {
					iframe.srcdoc = minifies(
						`<!DOCTYPE html><html><head>${style ? `<style>${style}</style>` : ``}</head><body>${html}${script ? `<script>${script}</script>` : ``}</body></html>`,
					);
				}
			}
		});
	}

	initEditor();
	setEditData(data);
});

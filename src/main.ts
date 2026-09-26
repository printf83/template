import { render, minifies } from "./page/render";
import { attachBtnPrintAll } from "./script/print";
import "./style/main.css";
import { attachBtnDownloadPdf } from "./script/pdf";
import { getEditData, initEditor, setEditData } from "./script/edit";
import { attachCopyFile } from "./script/copy";
import { attachDownloadFile } from "./script/download";
import { attachUploadFile } from "./script/upload";
import { attachEditorNew } from "./script/new";
import { getCurrentData, setCurrentData } from "./data/data";
import type { Data, SchemaItem } from "./type/data";
import { initData, initIcons } from "./script/utils";

document.addEventListener("DOMContentLoaded", async () => {
	initIcons();
	initEditor();

	const iframe = document.getElementById(
		"iframe",
	) as HTMLIFrameElement | null;

	const genPage = <const T extends readonly SchemaItem[]>(
		data: Data<T> | null,
	) => {
		if (iframe) {
			console.time("Build Template");

			const { html, style, script } = render(data);
			iframe.srcdoc = minifies(
				`<!DOCTYPE html>
				<html>
					<head>
						${style ? `<style>${style}</style>` : ``}
					</head>
					<body>
						${html}
						${script ? `<script>${script}</script>` : ``}
					</body>
				</html>`,
			);

			console.timeEnd("Build Template");
		}
	};

	const data = await initData();
	const currentData = setCurrentData(data);
	genPage(currentData);

	const btnPrintAll = document.getElementById(
		"btnPrintAll",
	) as HTMLButtonElement;
	if (iframe && btnPrintAll) {
		attachBtnPrintAll(btnPrintAll, iframe);
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

	const btnEditorNew = document.getElementById(
		"btnEditorNew",
	) as HTMLButtonElement;
	if (btnEditorUploadFile) {
		attachEditorNew(btnEditorNew);
	}

	const formMain = document.getElementById("formMain") as HTMLDivElement;
	const formEditor = document.getElementById("formEditor") as HTMLDivElement;
	const ctlMain = document.getElementById("ctlMain") as HTMLDivElement;
	const ctlEditor = document.getElementById("ctlEditor") as HTMLDivElement;
	const btnEditor = document.getElementById("btnEditor") as HTMLButtonElement;
	const btnEditorCancel = document.getElementById(
		"btnEditorCancel",
	) as HTMLButtonElement;
	const btnEditorSave = document.getElementById(
		"btnEditorSave",
	) as HTMLButtonElement;

	if (
		formMain &&
		formEditor &&
		ctlMain &&
		ctlEditor &&
		btnEditor &&
		btnEditorCancel &&
		btnEditorSave
	) {
		btnEditor.addEventListener("click", () => {
			ctlMain.classList.add("hidden");
			ctlEditor.classList.remove("hidden");
			formMain.classList.add("hidden");
			formEditor.classList.remove("hidden");

			setEditData(getCurrentData());
		});

		btnEditorCancel.addEventListener("click", () => {
			ctlEditor.classList.add("hidden");
			ctlMain.classList.remove("hidden");
			formEditor.classList.add("hidden");
			formMain.classList.remove("hidden");
		});

		btnEditorSave.addEventListener("click", () => {
			ctlEditor.classList.add("hidden");
			ctlMain.classList.remove("hidden");
			formEditor.classList.add("hidden");
			formMain.classList.remove("hidden");

			const editedData = getEditData();
			if (editedData) {
				setCurrentData(editedData);
				genPage(editedData);
			}
		});
	}
});

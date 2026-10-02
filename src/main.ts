import "./style/main.css";
import { render, minifies } from "./page/render";
import { attachBtnPrintAll } from "./script/print";
import { attachBtnDownloadPdf } from "./script/pdf";
import { getEditData, initEditor, setEditData } from "./script/edit";
import { attachCopyFile, attachUploadThumb } from "./script/copy";
import { attachDownloadFile } from "./script/download";
import { attachUploadFile } from "./script/upload";
import { attachEditorNew } from "./script/new";
import { getCurrentData, setCurrentData } from "./data/data";
import { getElementById, initData, initIcons } from "./script/utils";
import { attachBtnFaq } from "./script/faq";
import type { Data, SchemaItem } from "./type/data";
import { attachAddAbbr, attachCopyAbbr, attachPasteAbbr } from "./script/abbr";
import {
	attachAddAsset,
	attachCopyAsset,
	attachPasteAsset,
	attachUploadAsset,
} from "./script/asset";
import { db } from "./script/db";

const getAllElement = () => {
	const iframe = getElementById<HTMLIFrameElement>("iframe");

	const btnDownloadPdf = getElementById<HTMLButtonElement>("btnDownloadPdf");
	const btnPrintAll = getElementById<HTMLButtonElement>("btnPrintAll");
	const btnFaq = getElementById<HTMLButtonElement>("btnFaq");
	const btnEditorReadFile =
		getElementById<HTMLButtonElement>("btnEditorReadFile");
	const btnEditorDownloadFile = getElementById<HTMLButtonElement>(
		"btnEditorDownloadFile",
	);
	const btnEditorUploadFile = getElementById<HTMLButtonElement>(
		"btnEditorUploadFile",
	);
	const btnEditorNew = getElementById<HTMLButtonElement>("btnEditorNew");

	const inputThumbEditor = getElementById<HTMLInputElement>("thumb-editor");
	const prevThumbEditor = getElementById<HTMLDivElement>("thumb-prev-editor");

	const formMain = getElementById<HTMLDivElement>("formMain");
	const formEditor = getElementById<HTMLDivElement>("formEditor");
	const ctlMain = getElementById<HTMLDivElement>("ctlMain");
	const ctlEditor = getElementById<HTMLDivElement>("ctlEditor");

	const btnEditor = getElementById<HTMLButtonElement>("btnEditor");
	const btnEditorCancel =
		getElementById<HTMLButtonElement>("btnEditorCancel");
	const btnEditorSave = getElementById<HTMLButtonElement>("btnEditorSave");

	const btnAddAbbr = getElementById<HTMLButtonElement>("btnAddAbbr");
	const btnCopyAbbr = getElementById<HTMLButtonElement>("btnCopyAbbr");
	const btnPasteAbbr = getElementById<HTMLButtonElement>("btnPasteAbbr");
	const abbrList = getElementById<HTMLDivElement>("abbrList");

	const btnAddAsset = getElementById<HTMLButtonElement>("btnAddAsset");
	const btnUploadAsset = getElementById<HTMLButtonElement>("btnUploadAsset");
	const btnCopyAsset = getElementById<HTMLButtonElement>("btnCopyAsset");
	const btnPasteAsset = getElementById<HTMLButtonElement>("btnPasteAsset");
	const assetList = getElementById<HTMLDivElement>("assetList");

	return {
		iframe,
		btnDownloadPdf,
		btnPrintAll,
		btnFaq,
		btnEditorReadFile,
		btnEditorDownloadFile,
		btnEditorUploadFile,
		btnEditorNew,
		inputThumbEditor,
		prevThumbEditor,
		formMain,
		formEditor,
		ctlMain,
		ctlEditor,
		btnEditor,
		btnEditorCancel,
		btnEditorSave,
		btnAddAbbr,
		btnCopyAbbr,
		btnPasteAbbr,
		abbrList,
		btnAddAsset,
		btnUploadAsset,
		btnCopyAsset,
		btnPasteAsset,
		assetList,
	};
};

const genPage = <const T extends readonly SchemaItem[]>(
	data: Data<T> | null,
	iframe: HTMLIFrameElement,
) => {
	if (iframe) {
		console.time("Build Template");

		const { html, style, script } = render(data);
		iframe.dataset["filename"] = data?.title;

		iframe.srcdoc = minifies(
			`<!DOCTYPE html>
				<html>
					<head>
						<title>${data?.title}</title>
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

const setInterface = (
	current: "main" | "editor",
	ctlMain: HTMLDivElement,
	ctlEditor: HTMLDivElement,
	formMain: HTMLDivElement,
	formEditor: HTMLDivElement,
) => {
	if (formMain && formEditor && ctlMain && ctlEditor) {
		if (current === "main") {
			ctlEditor.classList.add("hidden");
			ctlMain.classList.remove("hidden");
			formEditor.classList.add("hidden");
			formMain.classList.remove("hidden");
		} else {
			ctlMain.classList.add("hidden");
			ctlEditor.classList.remove("hidden");
			formMain.classList.add("hidden");
			formEditor.classList.remove("hidden");
		}

		db.write("interface", current);
	}
};

document.addEventListener("DOMContentLoaded", async () => {
	initIcons();
	initEditor();

	const {
		iframe,
		btnDownloadPdf,
		btnPrintAll,
		btnFaq,
		btnEditorReadFile,
		btnEditorDownloadFile,
		btnEditorUploadFile,
		btnEditorNew,
		inputThumbEditor,
		prevThumbEditor,
		formMain,
		formEditor,
		ctlMain,
		ctlEditor,
		btnEditor,
		btnEditorCancel,
		btnEditorSave,
		btnAddAbbr,
		btnCopyAbbr,
		btnPasteAbbr,
		abbrList,
		btnAddAsset,
		btnUploadAsset,
		btnCopyAsset,
		btnPasteAsset,
		assetList,
	} = getAllElement();

	const data = await initData();
	const currentData = setCurrentData(data);
	genPage(currentData, iframe);

	attachBtnPrintAll(btnPrintAll, iframe);
	attachBtnDownloadPdf(btnDownloadPdf, btnEditor, btnPrintAll, iframe);
	attachBtnFaq(btnFaq);
	attachCopyFile(btnEditorReadFile);
	attachDownloadFile(btnEditorDownloadFile);
	attachUploadFile(btnEditorUploadFile);
	attachEditorNew(btnEditorNew);
	attachUploadThumb(prevThumbEditor, inputThumbEditor);
	attachAddAbbr(btnAddAbbr, abbrList);
	attachCopyAbbr(btnCopyAbbr, abbrList);
	attachPasteAbbr(btnPasteAbbr, abbrList);
	attachAddAsset(btnAddAsset, assetList);
	attachUploadAsset(btnUploadAsset, assetList);
	attachCopyAsset(btnCopyAsset, assetList);
	attachPasteAsset(btnPasteAsset, assetList);

	if (
		iframe &&
		formMain &&
		formEditor &&
		ctlMain &&
		ctlEditor &&
		btnEditor &&
		btnEditorCancel &&
		btnEditorSave
	) {
		const interfaceState = await db.read<"main" | "editor">("interface");

		if (interfaceState === "editor") {
			setEditData(getCurrentData());
			setInterface("editor", ctlMain, ctlEditor, formMain, formEditor);
		} else {
			setInterface("main", ctlMain, ctlEditor, formMain, formEditor);
		}

		btnEditor.addEventListener("click", () => {
			setInterface("editor", ctlMain, ctlEditor, formMain, formEditor);
			setEditData(getCurrentData());
		});

		btnEditorCancel.addEventListener("click", () => {
			setInterface("main", ctlMain, ctlEditor, formMain, formEditor);
		});

		btnEditorSave.addEventListener("click", async () => {
			setInterface("main", ctlMain, ctlEditor, formMain, formEditor);
			const editedData = getEditData();
			if (editedData) {
				setCurrentData(editedData);
				await db.write("current-data", editedData);
				genPage(editedData, iframe);
			}
		});
	}
});

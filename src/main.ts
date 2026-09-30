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
import {
	attachAddShortDictionary,
	attachCopyShortDictionary,
	attachPasteShortDictionary,
} from "./script/short";

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

	const btnEditorAddShortItem = getElementById<HTMLButtonElement>(
		"btnEditorAddShortItem",
	);
	const btnEditorCopyShortItem = getElementById<HTMLButtonElement>(
		"btnEditorCopyShortItem",
	);
	const btnEditorPasteShortItem = getElementById<HTMLButtonElement>(
		"btnEditorPasteShortItem",
	);
	const shortDictionaryContainer = getElementById<HTMLDivElement>(
		"shortDictionaryContainer",
	);

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
		btnEditorAddShortItem,
		btnEditorCopyShortItem,
		btnEditorPasteShortItem,
		shortDictionaryContainer,
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
		btnEditorAddShortItem,
		btnEditorCopyShortItem,
		btnEditorPasteShortItem,
		shortDictionaryContainer,
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
	attachAddShortDictionary(btnEditorAddShortItem, shortDictionaryContainer);
	attachCopyShortDictionary(btnEditorCopyShortItem, shortDictionaryContainer);
	attachPasteShortDictionary(
		btnEditorPasteShortItem,
		shortDictionaryContainer,
	);

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
				genPage(editedData, iframe);
			}
		});
	}
});

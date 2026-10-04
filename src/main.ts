import "./style/main.css";
import { render, minifies } from "./page/render";
import { attachBtnPrintAll } from "./script/print";
import { attachBtnDownloadPdf } from "./script/pdf";
import { getEditData, initEditor, setEditData } from "./script/edit";
import { attachCopyFile, attachUploadThumb } from "./script/copy";
import { attachDownloadFile } from "./script/download";
import { attachUploadFile } from "./script/upload";
import { attachEditorNew, attachEditorSave } from "./script/new";
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
import { attachBtnUserKey } from "./script/user";
import { getAuthContext, getUserName } from "./script/auth";
import { preloadTemplates } from "./script/preload";

const getAllElement = () => {
	const loadingElem = getElementById<HTMLDivElement>("loading");
	const mainElem = getElementById<HTMLDivElement>("main");
	const iframe = getElementById<HTMLIFrameElement>("iframe");

	const btnDownloadPdf = getElementById<HTMLButtonElement>("btnDownloadPdf");
	const btnPrintAll = getElementById<HTMLButtonElement>("btnPrintAll");
	const btnUserKey = getElementById<HTMLButtonElement>("btnUserKey");
	const btnUserKeyName = getElementById<HTMLSpanElement>("btnUserKeyName");
	const btnFaq = getElementById<HTMLButtonElement>("btnFaq");
	const btnEditorReadFile =
		getElementById<HTMLButtonElement>("btnEditorReadFile");
	const btnEditorDownloadFile = getElementById<HTMLButtonElement>(
		"btnEditorDownloadFile",
	);
	const btnEditorUploadFile = getElementById<HTMLButtonElement>(
		"btnEditorUploadFile",
	);
	const btnEditorSave = getElementById<HTMLButtonElement>("btnEditorSave");
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
	const btnEditorGenerate =
		getElementById<HTMLButtonElement>("btnEditorGenerate");

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
		loadingElem,
		mainElem,
		iframe,
		btnDownloadPdf,
		btnPrintAll,
		btnUserKey,
		btnUserKeyName,
		btnFaq,
		btnEditorReadFile,
		btnEditorDownloadFile,
		btnEditorUploadFile,
		btnEditorSave,
		btnEditorNew,
		inputThumbEditor,
		prevThumbEditor,
		formMain,
		formEditor,
		ctlMain,
		ctlEditor,
		btnEditor,
		btnEditorCancel,
		btnEditorGenerate,
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
		loadingElem,
		mainElem,
		iframe,
		btnDownloadPdf,
		btnPrintAll,
		btnUserKey,
		btnUserKeyName,
		btnFaq,
		btnEditorReadFile,
		btnEditorDownloadFile,
		btnEditorUploadFile,
		btnEditorSave,
		btnEditorNew,
		inputThumbEditor,
		prevThumbEditor,
		formMain,
		formEditor,
		ctlMain,
		ctlEditor,
		btnEditor,
		btnEditorCancel,
		btnEditorGenerate,
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

	// Initialize auth state/session first before querying storage
	await getAuthContext();
	btnUserKeyName.innerText = getUserName();

	const data = await initData();
	const currentData = setCurrentData(data);

	genPage(currentData, iframe);

	attachBtnUserKey(btnUserKey, async () => {
		// 1. Update the display name
		if (btnUserKeyName) {
			btnUserKeyName.innerText = getUserName();
		}

		// 2. Fetch data from the newly authenticated user's database cache
		const freshData = await initData();
		const updatedData = setCurrentData(freshData);

		// 3. Re-render the template with the new user's data
		genPage(updatedData, iframe);

		// 4. Update editor state if the user is currently on the editor view
		if (!formEditor.classList.contains("hidden")) {
			setEditData(getCurrentData());
		}
	});

	attachBtnPrintAll(btnPrintAll, iframe);
	attachBtnDownloadPdf(
		btnDownloadPdf,
		[btnEditor, btnPrintAll, btnUserKey],
		iframe,
	);
	attachBtnFaq(btnFaq);
	attachCopyFile(btnEditorReadFile);
	attachDownloadFile(btnEditorDownloadFile);
	attachUploadFile(btnEditorUploadFile);
	attachEditorSave(btnEditorSave);
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
		btnEditorGenerate
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

		btnEditorGenerate.addEventListener("click", async () => {
			setInterface("main", ctlMain, ctlEditor, formMain, formEditor);
			const editedData = getEditData();
			if (editedData) {
				setCurrentData(editedData);
				await db.write("current-data", editedData);
				genPage(editedData, iframe);
			}
		});
	}

	// Hide loading screen and display main layout
	if (loadingElem && mainElem) {
		mainElem.style.display = "block";

		// Clean up loading element from DOM after fade-out transition completes
		setTimeout(() => {
			loadingElem.remove();
		}, 300);
	}

	preloadTemplates();
});

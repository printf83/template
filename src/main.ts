import { registerSW } from "virtual:pwa-register";

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
import { clearAllStorage, db } from "./script/db";
import { attachBtnUserKey } from "./script/user";
import { getAuthContext, getUserName } from "./script/auth";
import { Modal } from "./script/modal";
import { attachBtnTheme } from "./script/dark";

const getAllElement = () => {
	const loadingElem = getElementById<HTMLDivElement>("loading");
	const mainElem = getElementById<HTMLDivElement>("main");
	const iframe = getElementById<HTMLIFrameElement>("iframe");
	const version = getElementById<HTMLSpanElement>("version");

	const btnDownloadPdf = getElementById<HTMLButtonElement>("btnDownloadPdf");
	const btnPrintAll = getElementById<HTMLButtonElement>("btnPrintAll");
	const btnUserKey = getElementById<HTMLButtonElement>("btnUserKey");
	const btnUserKeyName = getElementById<HTMLSpanElement>("btnUserKeyName");
	const btnTheme = getElementById<HTMLButtonElement>("btnTheme");
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
		version,
		btnDownloadPdf,
		btnPrintAll,
		btnUserKey,
		btnUserKeyName,
		btnTheme,
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

async function updateUserName(
	btnUserKey: HTMLButtonElement,
	btnUserKeyName: HTMLSpanElement,
) {
	const userName = getUserName();
	btnUserKeyName.innerText = userName;

	const icon = document.createElement("i");
	icon.dataset.icon = userName === "Guest" ? "users" : "user-shield";

	const svg = btnUserKey.querySelector("svg");
	if (svg) {
		svg.replaceWith(icon);
		return;
	}

	const i = btnUserKey.querySelector("i[data-icon]");
	if (i) {
		i.replaceWith(icon);
	}

	const { usageMB, quotaMB } = await db.usage();
	btnUserKey.title = `Storage usage ${((usageMB / quotaMB) * 100).toFixed(2)}%`;
}

document.addEventListener("DOMContentLoaded", async () => {
	initIcons();
	initEditor();

	const {
		loadingElem,
		mainElem,
		iframe,
		version,
		btnDownloadPdf,
		btnPrintAll,
		btnUserKey,
		btnUserKeyName,
		btnFaq,
		btnTheme,
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

	if (version) version.textContent = `v${import.meta.env.PACKAGE_VERSION}`;

	// Initialize auth state/session first before querying storage
	await getAuthContext();
	updateUserName(btnUserKey, btnUserKeyName);

	const data = await initData();
	const currentData = setCurrentData(data);

	genPage(currentData, iframe);

	attachBtnUserKey(btnUserKey, async () => {
		// 1. Update the display name
		updateUserName(btnUserKey, btnUserKeyName);
		initIcons();

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
	attachBtnTheme(btnTheme);
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

	// Register Ctrl+Delete (or Cmd+Delete on Mac) to clear all storage
	document.addEventListener("keydown", async (e: KeyboardEvent) => {
		// 1. Prevent shortcut while typing in input fields or textareas
		const target = e.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable)
		) {
			return;
		}

		// 2. Check for Ctrl+Delete (or Cmd+Delete on Mac) and ignore held-down key repeats
		if (
			(e.ctrlKey || e.metaKey) &&
			(e.code === "Delete" || e.key === "Delete") &&
			!e.repeat
		) {
			e.preventDefault();

			const confirm = await Modal.confirm(
				"Are you sure you want to clear all data and reload the page?",
				"Clear Data",
				"warning",
			);

			if (confirm) {
				const result = await clearAllStorage();
				if (result) window.location.reload();
			}
		}
	});

	// Register PWA Service Worker
	const updateSW = registerSW({
		async onNeedRefresh() {
			const result = await Modal.confirm(
				"New content available. Reload to update?",
				"Update Found!",
			);
			if (result) {
				updateSW(true);
			}
		},
		onOfflineReady() {
			console.log("App is ready to work offline.");
		},
	});
});

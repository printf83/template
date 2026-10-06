import { EditorView, basicSetup } from "codemirror";
import { Compartment, type Extension } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { ayuLight } from "thememirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { getFileMetadata, type ValueType } from "./utils";
import { pickFile } from "./copy";
import { downloadFile } from "./download";
import { Toast } from "./toast";

export type EditorLanguage = ValueType;

interface EditorOptions {
	container: HTMLDivElement;
	initialValue?: string;
	language?: EditorLanguage;
	isDark?: boolean;
	onChange?: (value: string) => void;
}

export interface CreatedEditorState {
	refresh: () => void;
	getValue: () => string;
	setValue: (text: string) => void;
	setLanguage: (newLanguage: EditorLanguage) => void;
	setTheme: (isDark: boolean) => void;
	destroy: () => void;
	view: EditorView;
}

function attachUploadDownload(
	container: HTMLDivElement,
	view: EditorView,
): () => void {
	if (!container || !view) return () => {};

	const formLabel = container.previousElementSibling as HTMLDivElement | null;
	if (!formLabel) return () => {};

	const btnUpload = formLabel.querySelector(".btn-code-upload");
	const btnDownload = formLabel.querySelector(".btn-code-download");

	const handleUpload = async () => {
		const fileType = formLabel.dataset.filetype || "";
		const fileContent = await pickFile(fileType);
		if (fileContent) {
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: fileContent.content,
				},
			});
		}
	};

	const handleDownload = async () => {
		const fileName = formLabel.dataset.filename || "download";
		const content = view.state.doc.toString();

		if (content) {
			const { fileExt, fileMime } = getFileMetadata(content);
			downloadFile(content, fileMime, `${fileName}.${fileExt}`);
		} else {
			Toast.error("Nothing to download");
		}
	};

	btnUpload?.addEventListener("click", handleUpload);
	btnDownload?.addEventListener("click", handleDownload);

	// Return cleanup function to detach event listeners
	return () => {
		btnUpload?.removeEventListener("click", handleUpload);
		btnDownload?.removeEventListener("click", handleDownload);
	};
}

function attachLabelClick(
	container: HTMLDivElement,
	view: EditorView,
): (() => void) | null {
	const id = container.getAttribute("id");
	if (!id) return null;

	const label = document.querySelector(
		`label[for="${id}"]`,
	) as HTMLLabelElement;
	if (!label) return null;

	const handleLabelClick = () => view.focus();
	label.addEventListener("click", handleLabelClick);

	return () => label.removeEventListener("click", handleLabelClick);
}

export function createCodeEditor({
	container,
	initialValue = "",
	language = "html",
	isDark = false,
	onChange,
}: EditorOptions): CreatedEditorState {
	const languageCompartment = new Compartment();
	const themeCompartment = new Compartment();

	// Select language syntax extension
	const getLanguageExtension = (lang: EditorLanguage) => {
		switch (lang) {
			case "css":
				return css();
			case "javascript":
				return javascript();
			case "json":
				return json();
			case "html":
				return html();
			case "csv":
			case "text":
			case "image":
			default:
				return []; // Plain text extension for CSV and text
		}
	};

	const getThemeExtension = (dark: boolean): Extension => {
		return dark ? oneDark : ayuLight;
	};

	const view = new EditorView({
		doc: initialValue,
		extensions: [
			basicSetup,
			languageCompartment.of(getLanguageExtension(language)),
			themeCompartment.of(getThemeExtension(isDark)),
			// EditorView.lineWrapping,
			EditorView.theme({
				"&": { height: "100%" },
				".cm-scroller": {
					overflow: "auto",
					fontFamily: "JetBrains Mono, monospace",
				},
			}),
			EditorView.updateListener.of((update) => {
				if (update.docChanged && onChange) {
					onChange(update.state.doc.toString());
				}
			}),
			EditorView.domEventHandlers({
				focus(event) {
					const parent = (event.target as HTMLElement).closest(
						".form-code",
					) as HTMLDivElement;

					if (parent) {
						parent.classList.add("focused");
					}
				},
				blur(event) {
					const parent = (event.target as HTMLElement).closest(
						".form-code",
					) as HTMLDivElement;

					if (parent) {
						parent.classList.remove("focused");
					}
				},
			}),
		],
		parent: container,
	});

	const removeUploadDownloadListeners = attachUploadDownload(container, view);
	const removeLabelListener = attachLabelClick(container, view);

	return {
		refresh: () => {
			view.update([]);
		},

		/** Get current editor string value */
		getValue: (): string => view.state.doc.toString(),

		/** Set editor string value programmatically */
		setValue: (text: string) => {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: text },
			});
		},

		/** Change language dynamically at runtime */
		setLanguage: (newLanguage: EditorLanguage) => {
			view.dispatch({
				effects: languageCompartment.reconfigure(
					getLanguageExtension(newLanguage),
				),
			});
		},

		/** Toggle or set dark theme at runtime */
		setTheme: (dark: boolean) => {
			view.dispatch({
				effects: themeCompartment.reconfigure(getThemeExtension(dark)),
			});
		},

		/** Destroy editor instance */
		destroy: () => {
			removeUploadDownloadListeners();
			if (removeLabelListener) removeLabelListener();
			view.destroy();
		},

		/** Direct access to CodeMirror view instance */
		view,
	};
}

import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { ayuLight as codeTheme } from "thememirror";
import { getFileMetadata, type ValueType } from "./utils";
import { pickFile } from "./copy";
import { downloadFile } from "./download";
import { Toast } from "./toast";

export type EditorLanguage = ValueType;

interface EditorOptions {
	container: HTMLDivElement;
	initialValue?: string;
	language?: EditorLanguage;
	onChange?: (value: string) => void;
}

export interface CreatedEditorState {
	refresh: () => void;
	getValue: () => string;
	setValue: (text: string) => void;
	setLanguage: (newLanguage: EditorLanguage) => void;
	destroy: () => void;
	view: EditorView;
}

function attachUploadDownload(container: HTMLDivElement, view: EditorView) {
	if (!container || !view) return;

	const formLabel = container.previousElementSibling as HTMLDivElement;
	const fileName = formLabel.dataset.filename as string;
	const fileType = formLabel.dataset.filetype as string;
	const btnUpload = formLabel.querySelector(".btn-code-upload");
	const btnDownload = formLabel.querySelector(".btn-code-download");

	if (btnUpload) {
		btnUpload.addEventListener("click", async () => {
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
		});
	}

	if (btnDownload) {
		btnDownload.addEventListener("click", async () => {
			const content = view.state.doc.toString();

			if (content) {
				const { fileExt, fileMime } = getFileMetadata(content);
				downloadFile(
					content,
					fileMime,
					`${fileName || "download"}.${fileExt}`,
				);
			} else {
				Toast.error("Noting to download");
			}
		});
	}
}

function attachLabelClick(container: HTMLDivElement, view: EditorView) {
	const id = container.getAttribute("id");
	if (id) {
		const label = document.querySelector(
			`label[for="${id}"]`,
		) as HTMLLabelElement;
		if (label) {
			label.addEventListener("click", () => {
				view.focus();
			});
		}
	}
}

export function createCodeEditor({
	container,
	initialValue = "",
	language = "html",
	onChange,
}: EditorOptions): CreatedEditorState {
	const languageCompartment = new Compartment();

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

	const view = new EditorView({
		doc: initialValue,
		extensions: [
			basicSetup,
			languageCompartment.of(getLanguageExtension(language)),
			codeTheme,
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

	attachUploadDownload(container, view);
	attachLabelClick(container, view);

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

		/** Destroy editor instance */
		destroy: () => view.destroy(),

		/** Direct access to CodeMirror view instance */
		view,
	};
}

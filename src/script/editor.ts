import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { ayuLight as codeTheme } from "thememirror";

export type EditorLanguage =
	| "json"
	| "javascript"
	| "css"
	| "html"
	| "image"
	| "csv"
	| "text";

export function detectValueType(value?: string): EditorLanguage {
	if (!value || typeof value !== "string") {
		return "text";
	}

	const trimmed = value.trim();
	if (!trimmed) return "text";

	// 1. Image Base64 Data URL
	if (/^data:image\/[a-zA-Z+.-]+;base64,/i.test(trimmed)) {
		return "image";
	}

	// 2. JSON (Must start/end with brackets and parse successfully)
	if (
		(trimmed.startsWith("{") && trimmed.endsWith("}")) ||
		(trimmed.startsWith("[") && trimmed.endsWith("]"))
	) {
		try {
			JSON.parse(trimmed);
			return "json";
		} catch {
			// Invalid JSON, fall through to other checks
		}
	}

	// 3. HTML (Contains DOCTYPE or HTML tag structure)
	if (
		/^\s*<!DOCTYPE\s+html/i.test(trimmed) ||
		/<[a-z][\s\S]*>/i.test(trimmed)
	) {
		return "html";
	}

	// 4. CSS (Matches selector/at-rule with property: value block)
	if (
		/^\s*(@[a-z-]+|[a-z0-9_.\-#*:\s,>+~\[\]="']+)\s*\{[\s\S]*:[^;]+;?[\s\S]*\}/i.test(
			trimmed,
		)
	) {
		return "css";
	}

	// 5. JavaScript (Contains key JS declaration keywords or syntax constructs)
	const jsPatterns = [
		/\b(const|let|var|function|return|import|export|class|async|await)\b/,
		/=>\s*[\{\(]|\bconsole\.(log|error|warn)\b/,
		/document\.(querySelector|getElementById|addEventListener)/,
		/window\.[a-zA-Z_$]/,
	];
	if (jsPatterns.some((pattern) => pattern.test(trimmed))) {
		return "javascript";
	}

	// 6. CSV (At least 2 lines with consistent comma/semicolon delimiter count)
	const lines = trimmed
		.split(/\r?\n/)
		.filter((line) => line.trim().length > 0);
	if (lines.length >= 2) {
		const delimiter = trimmed.includes(";") ? ";" : ",";
		const expectedCols = lines[0].split(delimiter).length;

		if (
			expectedCols > 1 &&
			lines.every((line) => line.split(delimiter).length === expectedCols)
		) {
			return "csv";
		}
	}

	// 7. Default Fallback
	return "text";
}

interface EditorOptions {
	container: HTMLElement;
	initialValue?: string;
	language?: EditorLanguage;
	onChange?: (value: string) => void;
}

export function createCodeEditor({
	container,
	initialValue = "",
	language = "html",
	onChange,
}: EditorOptions) {
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
			EditorView.lineWrapping,
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

	return {
		refresh: () => {
			view.requestMeasure();
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

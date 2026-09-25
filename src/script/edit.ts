import { getLangKey, NATIONALITY_CONFIG, SEX_CONFIG } from "../page/html";
import type { Data, SchemaItem } from "../type/data";
import { createCodeEditor, type EditorLanguage } from "./editor";

type CodeEditor = ReturnType<typeof createCodeEditor>;

type EditorKey = "data" | "html" | "style" | "script" | "asset" | "short";

const editorState: Partial<Record<EditorKey, CodeEditor>> = {};

function formatJson(val: unknown): string {
	if (val === undefined || val === null) return "{}";
	return typeof val === "string" ? val : JSON.stringify(val, null, 2);
}

function parseString(val: string | undefined): unknown {
	if (!val || val.trim() === "") return undefined;
	try {
		return JSON.parse(val);
	} catch (ex) {
		console.error("Failed to parse JSON string:", ex);
		return undefined;
	}
}

export function initEditor() {
	// Explicitly type language as EditorLanguage
	const configs: { key: EditorKey; id: string; language: EditorLanguage }[] =
		[
			{ key: "data", id: "data-editor", language: "json" },
			{ key: "html", id: "html-editor", language: "html" },
			{ key: "style", id: "style-editor", language: "css" },
			{ key: "script", id: "script-editor", language: "javascript" },
			{ key: "asset", id: "asset-editor", language: "json" },
			{ key: "short", id: "short-editor", language: "json" },
		];

	configs.forEach(({ key, id, language }) => {
		const container = document.getElementById(id) as HTMLDivElement | null;
		if (container) {
			editorState[key] = createCodeEditor({ container, language });
		}
	});

	// Set nationality placeholder base on lang
	function setPlaceholderBaseOnLang() {
		const lang = getValue("lang-editor");
		if (lang) {
			const langKey = getLangKey(lang);

			setPlaceholder(
				"nationality-citizen-editor",
				NATIONALITY_CONFIG[langKey].citizen,
			);
			setPlaceholder(
				"nationality-noncitizen-editor",
				NATIONALITY_CONFIG[langKey].nonCitizen,
			);
			setPlaceholder(
				"nationality-unknown-editor",
				NATIONALITY_CONFIG[langKey].unknown,
			);
			setPlaceholder("sex-male-editor", SEX_CONFIG[langKey].male);
			setPlaceholder("sex-female-editor", SEX_CONFIG[langKey].female);
			setPlaceholder("sex-unknown-editor", SEX_CONFIG[langKey].unknown);
		}
	}

	const langEditor = document.getElementById(
		"lang-editor",
	) as HTMLSelectElement;
	if (langEditor) {
		langEditor.addEventListener("change", () => setPlaceholderBaseOnLang());
		setPlaceholderBaseOnLang();
	}
}

function setValue<
	T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
>(id: string, value?: string) {
	const elem = document.getElementById(id) as T | null;
	if (elem) {
		elem.value = value || "";
	}
}

function setPlaceholder<T extends HTMLInputElement | HTMLTextAreaElement>(
	id: string,
	value?: string,
) {
	const elem = document.getElementById(id) as T | null;
	if (elem) {
		elem.placeholder = value || "";
	}
}

function getValue<
	T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
>(id: string): string | undefined {
	const elem = document.getElementById(id) as T | null;
	return elem ? elem.value : undefined;
}

/** Populates all initialized editors with data */
export function setEditData<T extends readonly SchemaItem[]>(data: Data<T>) {
	// Raw Text Editors
	editorState.html?.setValue(data.template ?? "");
	editorState.style?.setValue(data.style ?? "");
	editorState.script?.setValue(data.script ?? "");

	// JSON Editors
	editorState.data?.setValue(formatJson(data.record));
	editorState.asset?.setValue(formatJson(data.asset ?? {}));

	if ("short" in data) {
		editorState.short?.setValue(formatJson((data as any).short));
	}

	// Input Fields
	setValue("title-editor", data.title);
	setValue("thumb-editor", data.thumb);
	setValue("lang-editor", data.lang);
	setValue("nationality-citizen-editor", data.nationality?.citizen);
	setValue("nationality-noncitizen-editor", data.nationality?.nonCitizen);
	setValue("nationality-unknown-editor", data.nationality?.unknown);
	setValue("sex-male-editor", data.sex?.male);
	setValue("sex-female-editor", data.sex?.female);
	setValue("sex-unknown-editor", data.sex?.unknown);
}

export function getEditData<T extends readonly SchemaItem[]>(): Data<T> {
	return {
		title: getValue("title-editor"),
		thumb: getValue("thumb-editor"),
		lang: getValue("lang-editor"),
		nationality: {
			citizen: getValue("nationality-citizen-editor"),
			nonCitizen: getValue("nationality-noncitizen-editor"),
			unknown: getValue("nationality-unknown-editor"),
		},
		sex: {
			male: getValue("sex-male-editor"),
			female: getValue("sex-female-editor"),
			unknown: getValue("sex-unknown-editor"),
		},
		// Raw text fields (NOT JSON parsed)
		template: editorState.html?.getValue() ?? "",
		style: editorState.style?.getValue() ?? "",
		script: editorState.script?.getValue() ?? "",

		// JSON parsed fields
		short: parseString(editorState.short?.getValue()),
		asset: parseString(editorState.asset?.getValue()),
		record: parseString(editorState.data?.getValue()),
	} as Data<T>;
}

export { editorState };

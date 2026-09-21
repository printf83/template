import type { Data, SchemaItem } from "../type/data.d";
import { html } from "./html";
import { style } from "./style";

export function render<T extends readonly SchemaItem[], IsJson extends boolean>(
	data: Data<T, IsJson>,
): [html: string, style: string, script: string] {
	const generatedHtml = html(data);
	const generatedStyle = style(generatedHtml);
	const userStyle = data.style ?? "";

	// Concatenate generated atomic classes with custom user CSS
	const finalStyle = [generatedStyle, userStyle].filter(Boolean).join("\n");
	const script = data.script ?? "";

	console.log("Generated HTML:", generatedHtml);
	console.log("Generated Style:", finalStyle);

	return [generatedHtml, finalStyle, script];
}

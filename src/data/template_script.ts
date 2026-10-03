import { createData } from "./data";

export const data = createData({
	title: "Script",
	lang: "EN",
	schema: [
		{ key: "col1", type: "string" },
		{ key: "col2", type: "string" },
		{ key: "col3", type: "string" },
	],
	data: [
		{
			col1: "row 1 col 1",
			col2: "row 1 col 2",
			col3: "row 1 col 3",
		},
		{
			col1: "row 2 col 1",
			col2: "row 2 col 2",
			col3: "row 2 col 3",
		},
		{
			col1: "row 3 col 1",
			col2: "row 3 col 2",
			col3: "row 3 col 3",
		},
	],
	abbr: {
		long: "short",
	},
	asset: {
		"file-1": "",
	},
	template: `<div class="page a4 page-m-[15mm] font-sans" contenteditable="true">
	<div>Col1 : <span class="font-semibold" onclick="customScript(this);">{{col1}} [CLICK ME]</span></div>
	<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
	<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
</div>
	`,
	script: `function customScript(sender){
	sender.innerText = "Item Clicked"
}`,
	thumb: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtYnJhY2VzLWNvcm5lciBwcmV2aWV3LWljb24iPjxwYXRoIGQ9Ik0xNCAyMmg0YTIgMiAwIDAgMCAyLTJWOGEyLjQgMi40IDAgMCAwLS43MDYtMS43MDZsLTMuNTg4LTMuNTg4QTIuNCAyLjQgMCAwIDAgMTQgMkg2YTIgMiAwIDAgMC0yIDJ2NiIvPjxwYXRoIGQ9Ik0xNCAydjVhMSAxIDAgMCAwIDEgMWg1Ii8+PHBhdGggZD0iTTUgMTRhMSAxIDAgMCAwLTEgMXYyYTEgMSAwIDAgMS0xIDEgMSAxIDAgMCAxIDEgMXYyYTEgMSAwIDAgMCAxIDEiLz48cGF0aCBkPSJNOSAyMmExIDEgMCAwIDAgMS0xdi0yYTEgMSAwIDAgMSAxLTEgMSAxIDAgMCAxLTEtMXYtMmExIDEgMCAwIDAtMS0xIi8+PC9zdmc+",
});

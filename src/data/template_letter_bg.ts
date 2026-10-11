import { createData } from "./data";

async function assetCompanyLogo(): Promise<string> {
	const d = await import("../assets/company-logo.txt?raw");
	return d.default;
}

async function assetLetterBg(): Promise<string> {
	const d = await import("../assets/letter-bg.txt?raw");
	return d.default;
}

export const data = createData({
	title: "Letter Background",
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
	template: `<div class="page a4 page-mx-[15mm] page-mt-[10mm] font-sans relative asset-[bg] bg-cover bg-center" contenteditable="true">
	{{#asset letter-head}}
	<div class="h-[222mm]">
		<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
		<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
		<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	</div>
	{{#asset letter-foot}}
</div>`,
	style: "",
	script: "",
	abbr: {
		long: "short",
	},
	asset: {
		"company-name": "COMPANY NAME",
		"company-reg": "A10000-B",
		"company-address": `No 123-130, Tech Park,
Jalan Mat Salleh,
88100 Kota Kinabalu, Sabah`,
		"company-phone": "+6 000 000 0000",
		"company-fax": "+6 000 000 0000",
		"company-email": "admin@example.com",
		"letter-head": `<div class="flex flex-row justify-between gap-3 border-b pb-2 mb-5">
	<div class="flex flex-col">
		<h1 class="text-3xl font-bold text-shadow text-blue-900/80">{{#asset company-name}}</h1>
		<p class="text-sm">{{%br #asset company-address}}</p>
		<p class="text-sm">
			Tel : <b>{{#asset company-phone}}</b> | 
			Fax : <b>{{#asset company-fax}}</b> | 
			Email : <b>{{#asset company-email}}</b>
		</p>
	</div>
	<div class="w-32 h-32 p-2 flex">
		<div class="w-full h-full bg-contain bg-center bg-no-repeat asset-[company-logo]"></div>
	</div>
</div>`,
		"letter-foot": `<div class="text-xs flex flex-col items-center justify-center border-t pt-2 mt-5">
	<p class="text-blue-900/80 font-bold">{{#asset company-name}}</p>
	<p>Reg No : <b>{{#asset company-reg}}</b></p>
</div>`,
		"company-logo": await assetCompanyLogo(),
		bg: await assetLetterBg(),
	},
	thumb: "data:image/webp;base64,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",
});

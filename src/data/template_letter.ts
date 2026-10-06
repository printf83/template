import { createData } from "./data";

async function assetCompanyLogo(): Promise<string> {
	const d = await import("../assets/company-logo.txt?raw");
	return d.default;
}

export const data = createData({
	title: "Letter",
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
		"company-name": "COMPANY NAME",
		"company-reg": "A10000-B",
		"company-address": `No 123-130, Tech Park,
Jalan Mat Salleh,
88100 Kota Kinabalu, Sabah`,
		"company-phone": "+6 000 000 0000",
		"company-fax": "+6 000 000 0000",
		"company-email": "admin@example.com",
		"letter-head": `<div class="flex flex-row gap-3 border-b pb-2 mb-5">
	<div class="w-32 h-32 p-2 flex">
		<div class="w-full h-full bg-contain bg-center bg-no-repeat asset-[company-logo]"></div>
	</div>
	<div class="flex flex-col">
		<h1 class="text-3xl font-bold text-shadow text-blue-900/80">{{#asset company-name}}</h1>
		<p class="text-sm">{{%br #asset company-address}}</p>
		<p class="text-sm">
			Tel : <b>{{#asset company-phone}}</b> | 
			Fax : <b>{{#asset company-fax}}</b> | 
			Email : <b>{{#asset company-email}}</b>
		</p>
	</div>
</div>`,
		"letter-foot": `<div class="text-xs flex flex-col items-center justify-center border-t pt-2 mt-5">
	<p class="text-blue-900/80 font-bold">{{#asset company-name}}</p>
	<p>Reg No : <b>{{#asset company-reg}}</b></p>
</div>`,
		"company-logo": await assetCompanyLogo(),
	},
	template: `<div class="page a4 page-mx-[15mm] page-mt-[10mm] font-sans relative" contenteditable="true">
	{{#asset letter-head}}
	<div class="h-[222mm]">
		<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
		<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
		<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	</div>
	{{#asset letter-foot}}
</div>
	`,
	thumb: "data:image/png;base64,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0+/3SdMUz/NYXFxkfn5+1ts1U8e+8DeZK04myJPzaRzHHBwcEIbh9Da03++jtT5ye3knO/bwT9OUXq+H53mMRqPpX5WiKEJKiVKKMAwpl8vT270sy6jX61QqlVlv10wde/iHYUin02E4HCIQrK6tkiQJGxsb9Pt91tfXWVhYYGdnh83NTXzfn1647vSot7yjGo/H088nF58syyiKAtd1cV2XLMtI0xTXddFao5S6408BdvJvgP0PFQNsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANsVANuucB3HMezHt+JpZRCKXXTr91yKd7J2qmftUJrdHFjrVaNRvCecQgQwGRlQiE++3FO1pE9zolcOPFaZ8DO3iHxOAUEUoKUkmY9IB5nRHFKlhWUA8WD97eRcjZP/nFO3KLRWms8J2f5VJk8LxACPOUxHsdIWUCeILwMJ3DwPE2eZ0ipPv0vvo1OXNSiKOhsv83h4SHNZpMoilhdXWVvZ5O9vX263S5JklCv1XCVoln7Bq1Wa9bDPuJEHv6T1dknC95KKSmKAq319L2UNyYunudNPz4pTmTUz7uT9RR/QfwPn4/NjbKEF5IAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMTAtMDZUMDg6NDU6NDcrMDA6MDAFhTUPAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTEwLTA2VDA4OjQ1OjQ3KzAwOjAwdNiNswAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0xMC0wNlQwODo0NTo1MyswMDowMBsoiOEAAAAASUVORK5CYII=",
});

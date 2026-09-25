import { createData } from "./data";

export const data = createData({
	title: "Test_0001",
	lang: "MY",
	schema: [
		{ key: "id", type: "number" },
		{ key: "firstName", type: "string" },
		{ key: "lastName", type: "string" },
		{ key: "nric", type: "string" },
	],
	data: [
		{
			id: 101,
			firstName: "Abu",
			lastName: "Bakar",
			nric: "800101141234",
		},
		{
			id: 102,
			firstName: "Ahmad",
			lastName: "Mazlan",
			nric: "900202081234",
		},
		{
			id: 103,
			firstName: "Faizal",
			lastName: "Hussin",
			nric: "950303971231",
		},
	],
	short: {
		"sekolah kebangsaan": "sk",
	},
	asset: {
		"file-1": `HELLO <span class="font-semibold">WORLD</span>`,
		"file-2":
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
	},
	template: `
	<div class="page a4 page-mx-[10mm] font-sans page-mb-[10mm] page-mt-[20mm]" contenteditable="true">
        <div>User <span class="text-red font-bold text-sm bg-yellow d-inline px-2 rounded-lg">{{%uppercase firstName}}</span> has ID {{%number_text id}}.</div>
    </div>
	`,
});

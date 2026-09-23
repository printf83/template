import { createData } from "./data";

export const data = createData({
	title: "Test_0001",
	lang: "MY",
	isJson: true,
	schema: [
		{ key: "id", type: "number" },
		{
			key: "user",
			type: "object",
			children: [
				{ key: "firstName", type: "string" },
				{ key: "lastName", type: "string" },
				{ key: "nric", type: "string" },
				{
					key: "settings",
					type: "object",
					children: [{ key: "notifications", type: "boolean" }],
				},
			],
		},
		{
			key: "tags",
			type: "array",
			items: { key: "tag", type: "string" },
		},
	],
	record: [
		{
			id: 101,
			user: {
				firstName: "Abu",
				lastName: "Bakar",
				nric: "800101141234",
				settings: {
					notifications: true, // ❌ Error if passed a string/number instead of boolean
				},
			},
			tags: ["typescript", "schema"], // ❌ Error if array elements are not strings
		},
		{
			id: 102,
			user: {
				firstName: "Ahmad",
				lastName: "Mazlan",
				nric: "900202081234",
				settings: {
					notifications: true,
				},
			},
			tags: ["typescript", "schema", "bbb"],
		},
		{
			id: 103,
			user: {
				firstName: "Faizal",
				lastName: "Hussin",
				nric: "950303971231",
				settings: {
					notifications: false,
				},
			},
			tags: ["typescript", "schema", "xxx"],
		},
	],
	asset: {
		"file-1": "HELLO WORLD",
		"file-2":
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
	},
	template: `
	<div class="page a4 page-mx-[10mm] page-mb-[10mm] page-mt-[20mm]" contenteditable="true">
        <div>User <span class="text-red font-bold text-sm bg-yellow d-inline px-2 rounded-lg">{{%uppercase user.firstName}}</span> has ID {{%number_text id}}.</div>
		{{#user}}
		<div>Sex: {{%sex nric}}</div>
		<div>Nationality: {{%nationality nric}}</div>
		<div>Age: {{%age nric}}</div>
		<div>UID: {{root.id}}</div>
		{{/user}}
		<div class="flex gap-2">Tags: {{#loop tags}}<span>{{_this}}</span>{{/loop tags}}</div>
		{{#if user.settings.notifications}}<div class="inline-block bg-yellow text-red font-bold">[NOTIFICATION!!!]</div>{{/if user.settings.notifications}}
		<div>{{#asset file-1}}</div>
		<div class="asset-[file-2] w-40 h-40"></div>
    </div>
	`,
});

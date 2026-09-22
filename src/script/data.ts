import { createData } from "../type/data.d";

export const data = createData({
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
	template: `
	<div class="page a4 page-m-[10mm]">
        <div>User <span class="text-red font-bold text-sm bg-yellow d-inline px-2 rounded-lg">{{%uppercase user.firstName}}</span> has ID {{%number_text id}}.</div>
		{{#user}}
		<div>Sex: {{%sex nric}}</div>
		<div>Nationality: {{%nationality nric}}</div>
		<div>Age: {{%age nric}}</div>
		{{/user}}
		<div class="flex gap-2">Tags: {{#loop tags}}<span>{{_this}}</span>{{/loop tags}}</div>
		{{#if user.settings.notifications}}<div class="inline-block bg-yellow text-red font-bold">[NOTIFICATION!!!]</div>{{/if user.settings.notifications}}
    </div>
	`,
});

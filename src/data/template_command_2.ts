import { createData } from "./data";

export const data = createData({
	title: "Command 2",
	lang: "EN",
	schema: [
		{ key: "id", type: "number" },
		{ key: "name", type: "string" },
		{
			key: "lang",
			type: "array",
			items: {
				key: "item",
				type: "object",
				children: [
					{ key: "title", type: "string" },
					{ key: "level", type: "number" },
				],
			},
		},
		{
			key: "hobby",
			type: "array",
			items: { key: "item", type: "string" },
		},
		{
			key: "notify",
			type: "number",
		},
	],
	data: [
		{
			id: 1,
			name: "Ahmad Firdaus bin Zamri",
			lang: [
				{ title: "C++", level: 5 },
				{ title: "Basic", level: 8 },
				{ title: "Visual Basic", level: 4 },
			],
			hobby: ["Reading", "Gardening", "Cooking"],
			notify: 4,
		},
		{
			id: 2,
			name: "Nurul Aisyah binti Mansor",
			lang: [
				{ title: "Javascript", level: 4 },
				{ title: "Typescript", level: 9 },
				{ title: "GoLang", level: 2 },
			],
			hobby: ["Hiking", "Photography"],
			notify: 2,
		},
		{
			id: 3,
			name: "Muhammad Khairul bin Azman",
			lang: [
				{ title: "Rust", level: 7 },
				{ title: "Python", level: 3 },
				{ title: "C#", level: 5 },
				{ title: "Java", level: 9 },
			],
			hobby: ["Painting"],
			notify: 0,
		},
		{
			id: 4,
			name: "Siti Aminah binti Razali",
			lang: [],
			hobby: ["Gaming", "Traveling", "Knitting", "Writing"],
			notify: 2,
		},
		{
			id: 5,
			name: "Mohd Syazwan bin Bakri",
			lang: [
				{ title: "Ruby", level: 2 },
				{ title: "SQL", level: 6 },
				{ title: "PHP", level: 7 },
				{ title: "R", level: 3 },
			],
			hobby: [],
			notify: 3,
		},
	],
	short: {
		javascript: "js",
		typescript: "ts",
		golang: "go",
	},
	asset: {
		"file-1": "",
	},
	template: `<div class="page a4 page-m-[15mm]" contenteditable="true">
	<div>Name : <span class="font-semibold"><!---name---></span></div>

	<!---#if lang--->
	<div>Language : 
		<div class="flex flex-col">
		<!---#loop lang--->
			<div class="flex gap-1">
				<span><!---%short title---></span>
				<span>(Level #<!---level--->)</span>
			</div>
		<!---/loop lang--->
		</div>
	</div>
	<!---/if lang--->

	<!---#if hobby--->
	<div>Hobby : 
		<div class="flex gap-2">
		<!---#loop hobby--->
			<span class="bg-gray-200 px-2 py-1 rounded"><!---_this---></span>
		<!---/loop hobby--->
		</div>
	</div>
	<!---/if hobby--->

	<!---#if notify--->
	<div>Notification : 
		<span class="font-semibold text-rose-600">You have <!---%lowercase %number_text notify---> notification.</span>
	</div>
	<!---/if notify--->

	<!---#ifnot notify--->
	<div>Notification : 
		<span class="font-semibold text-blue-600">No notification.</span>
	</div>
	<!---/ifnot notify--->

</div>
	`,
	thumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABQElEQVRIS7WU20lEMRCGv7UAFS9FqGAB2sEqCGItPggivliNb6JW4HbgpQgvWIAog5MwGTM5WdzzvWzyz5z5s5MwE0Zmklcj4Q2OgFNgR/ePwBVwq3vPYL41OARu8q7kALjLu1+68q3BA7AHXAMXql0CJ8AM2Fct0ZVvDd6ANWALeFFN1k8a21At8QGsDuVbg1dgHdgGnrMK3/rr76umJwOptSlC1KJzc6paIcHru9qq46hFrUublylwLwt/KjE502e3nNU+5E6kPfJM84vzBjV8KxKRXtAMKlGhSC9oBpWoUKQXNINKVCjSC3zQzpaVrPbx+Z9ZNC9ds0ienBC1wusyAZqzaBGjQr6VNr1rrSKYhp30P53+zweGrnxr4GfRUu0vG7ryrUHrkvNsMXTl+77aWfRVmy2OwXxvsHBGN/gBqNpkGYRxOXEAAAAQZGVCR0NCNzU1ODYyNjBFNjJBRTOwqXgDAAAAAElFTkSuQmCC",
});

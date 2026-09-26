import { createData } from "./data";

export const data = createData({
	title: "Function",
	lang: "EN",
	schema: [
		{ key: "id", type: "number" },
		{ key: "name", type: "string" },
		{ key: "nric", type: "string" },
		{ key: "job", type: "string" },
		{ key: "salary", type: "number" },
		{ key: "weight", type: "number" },
	],
	data: [
		{
			id: 1,
			name: "Ahmad Firdaus bin Zamri",
			nric: "931015145633",
			job: "Software Engineer",
			salary: 6500,
			weight: 72.5,
		},
		{
			id: 2,
			name: "Nurul Aisyah binti Mansor",
			nric: "960422105844",
			job: "Accountant",
			salary: 5200,
			weight: 55.2,
		},
		{
			id: 3,
			name: "Muhammad Khairul bin Azman",
			nric: "891102086315",
			job: "Project Manager",
			salary: 8500,
			weight: 80.1,
		},
		{
			id: 4,
			name: "Siti Aminah binti Razali",
			nric: "010708035296",
			job: "Data Analyst",
			salary: 4800,
			weight: 61.8,
		},
		{
			id: 5,
			name: "Mohd Syazwan bin Bakri",
			nric: "950213115477",
			job: "Marketing Executive",
			salary: 4300,
			weight: 68.4,
		},
	],
	short: {
		executive: "exc",
		manager: "mgr",
		engineer: "eng",
	},
	asset: {
		"file-1": "",
	},
	template: `<div class="page a4 page-m-[15mm]" contenteditable="true">
	<div>ID : <span class="font-semibold">{{id}}</span></div>
	<div>Name : <span class="font-semibold">{{name}}</span></div>
	<div>Nric : <span class="font-semibold">{{%nric nric}}</span></div>
	<div class="flex gap-2">Age : 
		<span class="font-semibold">{{%age nric}} yo</span>
		<span class="italic">({{%titlecase %number_text %age nric}} Years Old)</span>
	</div>
	<div>Sex : <span class="font-semibold">{{%sex nric}}</span></div>
	<div>Nationality : <span class="font-semibold">{{%nationality nric}}</span></div>
	<div>Job : <span class="font-semibold">{{%short job}}</span></div>
	<div class="flex gap-2">Salary : 
		<span class="font-semibold">MYR {{%money salary}}</span>
		<span class="italic">(Malaysian Ringgit {{%titlecase %money_text salary}} Only)</span>
	</div>
	<div class="flex gap-2">Weight : 
		<span class="font-semibold">{{%number weight}} Kg</span>
		<span class="italic">({{%titlecase %number_text weight}} Kilogram)</span>
	</div>
</div>
	`,
	thumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFEUExURQAAACMfHyMfICEhISMeICQfHxkUFCceISIeICMhIiMdIyMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfICMfIP///y7gvRgAAABrdFJOUwAAAAAAAAAAAAAABC+Utkco1Om6RnvwAqrLDA0kJRcwH+WCx54BZ+I4E0/zcWr1UEWQEnVsKuGhA8/+7bEZwghU+HNE8ouN5CIYec3vlWMn44MJqejX0yBMSqgLMWLm/V3uIYQ8XruKdGvMj6jgkAAAAAFiS0dEa1JlpZgAAAAJcEhZcwAA7DgAAOw4AXEryjgAAAAHdElNRQfqCRoJFzESM/jtAAABGUlEQVQoz3WSd1fCMBTFwxVcFIRSSEtVrIqouBW3glo37oELB8vx/T+AIbQ9HBPfHznJ+yXv3dyEEB4+NIMI0cwGJaADUELhPkgORKJqTBOBH/GEJisFqhtJuP3bdMA0dAr0DwABlhxMUXfHkDXM1iOj6TTgw1hmvAXoxGR2ysT0zOzc/AJdXMotr6xyoKyp6xubW7HtfGFnd8/ex8HhEQfHJ6fFs/OLyytc39ze3ZfwkH10ejwZz3gploHU69s7Gz/K4D5xUSIgqFhVoCSU6kTNrgP5htP802uOul1Dlyv36zuXceSialXgXbC77YK6YYK0LOnxLGGT5A8TRf6ayJ5OS8RllmsNNRqRgnBIgb9XBIHg/x9Elv8FS3kr3/pHOpcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjYtMDktMjZUMDk6MjM6NDkrMDA6MDACnxuPAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI2LTA5LTI2VDA5OjIzOjQ5KzAwOjAwc8KjMwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNi0wOS0yNlQwOToyMzo0OSswMDowMCTXguwAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC",
});

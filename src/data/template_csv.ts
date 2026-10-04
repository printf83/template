import { createData } from "./data";

export const data = createData({
	title: "CSV",
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
		"text-1": "text-1",
	},
	template: `<div class="page a4 page-m-[15mm] font-sans" contenteditable="true">
	<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
	<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
	<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
</div>
	`,
	thumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABxklEQVRIibXWT4hNcRQH8I9pmqRJkzRJkrITErGwfAgrSpF/C82GhZX1LEYpbLBXkw3GwhYhpWlYCGniLTDFZhrU2IjFzFicH27X71135j2nbr1z7u/3/f7O9/zOuQ/6MYGZeTxfsE0NW4QGHuIqPtbYsxV7MI29ePavDQ3M1T0RTooMDuITNlct7q4JmrNbaf8d7MbLThPAdXThHnbhVScIZtGDpfiGm8m/jx0Yb5fgsTj118y7a9jSLkETa7EpEf2yM1hZXrzQGkzibil2KEfQVQ502v47QU6inbiEJfPE6he36V3yRzHA3538KPmdeLbnJFpc+H0bx3EaH8S9HxQFPY8pnPKni8+KDv+NVVWDURzAarzFkOjcy9gnBuQkxjCcyIawrAhSdU3HRLeeK8TeYw2OCkl7cULUbIO4po0iSFUGq4QkTVwUUjzHfrzBayHhkZTJBRzLYZaL/CT5P8RI7kYfbuBFymA51osP1Vxa15eIi0VuVEnUgxEx3IqnmsjERlpgzOYkelDyc2vqNOgUxnMZDKYT9dYAKe9bh8PJb2K6lUTjLeJV9hnf8bQYLBIMiDGxUNvY6sUK8W+i3bEwgytl8J9N0Yp/RXYqMQAAAABJRU5ErkJggg==",
});

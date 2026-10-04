import{t as e}from"./index-Cy7Q1s8J.js";var t=e({title:`Command 1`,lang:`EN`,schema:[{key:`id`,type:`number`},{key:`name`,type:`string`},{key:`lang`,type:`array`,items:{key:`item`,type:`object`,children:[{key:`title`,type:`string`},{key:`level`,type:`number`}]}},{key:`hobby`,type:`array`,items:{key:`item`,type:`string`}},{key:`notify`,type:`number`}],data:[{id:1,name:`Ahmad Firdaus bin Zamri`,lang:[{title:`C++`,level:5},{title:`Basic`,level:8},{title:`Visual Basic`,level:4}],hobby:[`Reading`,`Gardening`,`Cooking`],notify:4},{id:2,name:`Nurul Aisyah binti Mansor`,lang:[{title:`Javascript`,level:4},{title:`Typescript`,level:9},{title:`GoLang`,level:2}],hobby:[`Hiking`,`Photography`],notify:2},{id:3,name:`Muhammad Khairul bin Azman`,lang:[{title:`Rust`,level:7},{title:`Python`,level:3},{title:`C#`,level:5},{title:`Java`,level:9}],hobby:[`Painting`],notify:0},{id:4,name:`Siti Aminah binti Razali`,lang:[],hobby:[`Gaming`,`Traveling`,`Knitting`,`Writing`],notify:2},{id:5,name:`Mohd Syazwan bin Bakri`,lang:[{title:`Ruby`,level:2},{title:`SQL`,level:6},{title:`PHP`,level:7},{title:`R`,level:3}],hobby:[],notify:3}],abbr:{javascript:`js`,typescript:`ts`,golang:`go`},asset:{"text-1":`text-1`},template:`<div class="page a4 page-m-[15mm] font-sans" contenteditable="true">
	<div>Name : <span class="font-semibold">{{name}}</span></div>

	{{#if lang}}
	<div>Language : 
		<div class="flex flex-col">
		{{#loop lang}}
			<div class="flex gap-1">
				<span>{{%abbr title}}</span>
				<span>(Level #{{level}})</span>
			</div>
		{{/loop lang}}
		</div>
	</div>
	{{/if lang}}

	{{#if hobby}}
	<div>Hobby : 
		<div class="flex gap-2">
		{{#loop hobby}}
			<span class="bg-gray-200 px-2 py-1 rounded">{{_this}}</span>
		{{/loop hobby}}
		</div>
	</div>
	{{/if hobby}}

	{{#if notify}}
	<div>Notification : 
		<span class="font-semibold text-rose-600">You have {{%lowercase %number_text notify}} notification.</span>
	</div>
	{{/if notify}}

	{{#ifnot notify}}
	<div>Notification : 
		<span class="font-semibold text-blue-600">No notification.</span>
	</div>
	{{/ifnot notify}}

</div>
	`,thumb:`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJyYWNlcyBwcmV2aWV3LWljb24iPjxwYXRoIGQ9Ik04IDNIN2EyIDIgMCAwIDAtMiAydjVhMiAyIDAgMCAxLTIgMiAyIDIgMCAwIDEgMiAydjVjMCAxLjEuOSAyIDIgMmgxIi8+PHBhdGggZD0iTTE2IDIxaDFhMiAyIDAgMCAwIDItMnYtNWMwLTEuMS45LTIgMi0yYTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDAtMi0yaC0xIi8+PC9zdmc+`});export{t as data};
import{t as e}from"./index-FlyTLdJs.js";var t=e({title:`Function`,lang:`EN`,schema:[{key:`id`,type:`number`},{key:`name`,type:`string`},{key:`nric`,type:`string`},{key:`job`,type:`string`},{key:`salary`,type:`number`},{key:`weight`,type:`number`}],data:[{id:1,name:`Ahmad Firdaus bin Zamri`,nric:`931015145633`,job:`Software Engineer`,salary:6500,weight:72.5},{id:2,name:`Nurul Aisyah binti Mansor`,nric:`960422105844`,job:`Accountant`,salary:5200,weight:55.2},{id:3,name:`Muhammad Khairul bin Azman`,nric:`891102086315`,job:`Project Manager`,salary:8500,weight:80.1},{id:4,name:`Siti Aminah binti Razali`,nric:`010708035296`,job:`Data Analyst`,salary:4800,weight:61.8},{id:5,name:`Mohd Syazwan bin Bakri`,nric:`950213115477`,job:`Marketing Executive`,salary:4300,weight:68.4}],abbr:{executive:`exc`,manager:`mgr`,engineer:`eng`},asset:{"text-1":`text-1`},template:`<div class="page a4 page-m-[15mm] font-sans" contenteditable="true">
	<div>ID : <span class="font-semibold">{{id}}</span></div>
	<div>Name : <span class="font-semibold">{{name}}</span></div>
	<div>Nric : <span class="font-semibold">{{%nric nric}}</span></div>
	<div class="flex gap-2">Age : 
		<span class="font-semibold">{{%age nric}} yo</span>
		<span class="italic">({{%titlecase %number_text %age nric}} Years Old)</span>
	</div>
	<div>Sex : <span class="font-semibold">{{%sex nric}}</span></div>
	<div>Nationality : <span class="font-semibold">{{%nationality nric}}</span></div>
	<div>Job : <span class="font-semibold">{{%abbr job}}</span></div>
	<div class="flex gap-2">Salary : 
		<span class="font-semibold">MYR {{%money salary}}</span>
		<span class="italic">(Malaysian Ringgit {{%titlecase %money_text salary}} Only)</span>
	</div>
	<div class="flex gap-2">Weight : 
		<span class="font-semibold">{{%number weight}} Kg</span>
		<span class="italic">({{%titlecase %number_text weight}} Kilogram)</span>
	</div>
</div>
	`,thumb:`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBlcmNlbnQgcHJldmlldy1pY29uIj48bGluZSB4MT0iMTkiIHgyPSI1IiB5MT0iNSIgeTI9IjE5Ii8+PGNpcmNsZSBjeD0iNi41IiBjeT0iNi41IiByPSIyLjUiLz48Y2lyY2xlIGN4PSIxNy41IiBjeT0iMTcuNSIgcj0iMi41Ii8+PC9zdmc+`});export{t as data};
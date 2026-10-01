import{t as e}from"./index-CY8a2pdh.js";import{t}from"./company-logo-Fha68yO9.js";var n=e({title:`Letter`,lang:`EN`,schema:[{key:`col1`,type:`string`},{key:`col2`,type:`string`},{key:`col3`,type:`string`}],data:[{col1:`row 1 col 1`,col2:`row 1 col 2`,col3:`row 1 col 3`},{col1:`row 2 col 1`,col2:`row 2 col 2`,col3:`row 2 col 3`},{col1:`row 3 col 1`,col2:`row 3 col 2`,col3:`row 3 col 3`}],abbr:{long:`short`},asset:{"company-name":`COMPANY NAME`,"company-reg":`A10000-B`,"company-address":`No 123-130, Tech Park,<br/>Jalan Mat Salleh,<br/>88100 Kota Kinabalu, Sabah`,"company-phone":`+6 000 000 0000`,"company-fax":`+6 000 000 0000`,"company-email":`admin@example.com`,"letter-head":`<div class="flex flex-row gap-3 border-b pb-2 mb-5">
			<div class="w-32 h-100 p-2 flex">
				<div class="w-full h-full bg-contain bg-center bg-no-repeat asset-[company-logo]"></div>
			</div>
			<div class="flex flex-col">
				<h1 class="text-3xl font-bold text-indigo-600">{{#asset company-name}}</h1>
				<p class="text-sm">{{#asset company-address}}</p>
				<p class="text-sm">
					Tel : <b>{{#asset company-phone}}</b> | 
					Fax : <b>{{#asset company-fax}}</b> | 
					Email : <b>{{#asset company-email}}</b>
				</p>
			</div>
		</div>`,"letter-foot":`<div class="text-xs flex flex-col items-center justify-center border-t pt-2 mt-5">
			<p class="text-indigo-600 font-semibold">{{#asset company-name}}</p>
			<p>Reg No : <b>{{#asset company-reg}}</b></p>
		</div>`,"company-logo":t},template:`<div class="page a4 page-mx-[15mm] page-mt-[10mm] relative" contenteditable="true">
	{{#asset letter-head}}
	<div class="h-[225mm]">
		<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
		<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
		<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	</div>
	{{#asset letter-foot}}
</div>
	`,thumb:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABNklEQVRIS+3VzSpFURjG8Z+JG0AUMVJyCQY+EjdAyX3IDZgp92BoZK4UKZcgmVBK+RqZGtBi7dX27nNy9olM/Cdnr3e/z/Osvc6qd8AvM1CePhnDLlYxWqqdecU+tvBSqoEYcICNsuqNSyzisVRqxIBnDGEBZ6Xa5C3/3mISV1nzkOuFGFAJYz1S9U3gHFO4xjzu8rsPolHbgNQ3jhNM4wZzuM/vG0b9BCTShTjFDA6xlusNoyjsxgVmy+or6XYNVotoFAPSp6cbkkg7XMrP69jJO+5E8e03oBtR/21AWxr6aNRoaElDH41iQ/2IulE/uqj/+4C2tP6CtjT00Sg2/P8H3x5RWxr6aPSE4R4GTieWcZyH1khVjAH9jMxI8tisFjEgDf09rNR30SNpXB5huz46Y8CP8w5IlEwZQXee/QAAABBkZUJHREVGQTI0RUY4Q0I3Nzk0MUi2PYoAAAAASUVORK5CYII=`});export{n as data};
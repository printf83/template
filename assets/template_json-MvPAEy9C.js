import{t as e}from"./index-CY8a2pdh.js";var t=e({title:`JSON`,lang:`EN`,schema:[{key:`col1`,type:`string`},{key:`col2`,type:`string`},{key:`col3`,type:`string`},{key:`col4`,type:`array`,items:{key:`item`,type:`object`,children:[{key:`child1`,type:`string`},{key:`child2`,type:`string`}]}}],data:[{col1:`row 1 col 1`,col2:`row 1 col 2`,col3:`row 1 col 3`,col4:[{child1:`row 1 col 4 list 1 child 1`,child2:`row 1 col 4 list 1 child 2`},{child1:`row 1 col 4 list 2 child 1`,child2:`row 1 col 4 list 2 child 2`},{child1:`row 1 col 4 list 3 child 1`,child2:`row 1 col 4 list 3 child 2`}]},{col1:`row 2 col 1`,col2:`row 2 col 2`,col3:`row 2 col 3`,col4:[{child1:`row 2 col 4 list 1 child 1`,child2:`row 2 col 4 list 1 child 2`},{child1:`row 2 col 4 list 2 child 1`,child2:`row 2 col 4 list 2 child 2`},{child1:`row 2 col 4 list 3 child 1`,child2:`row 2 col 4 list 3 child 2`}]},{col1:`row 3 col 1`,col2:`row 3 col 2`,col3:`row 3 col 3`,col4:[{child1:`row 3 col 4 list 1 child 1`,child2:`row 3 col 4 list 1 child 2`},{child1:`row 3 col 4 list 2 child 1`,child2:`row 3 col 4 list 2 child 2`},{child1:`row 3 col 4 list 3 child 1`,child2:`row 3 col 4 list 3 child 2`}]}],abbr:{long:`short`},asset:{"file-1":``},template:`<div class="page a4 page-m-[15mm]" contenteditable="true">
	<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
	<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
	<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	<div>Col4 : 
		<div class="flex flex-col gap-2">
		{{#loop col4}}
			<div class="flex gap-2">
				<span class="bg-gray-200">{{child1}}</span>
				<span class="bg-gray-200">{{child2}}</span>
			</div>
		{{/loop col4}}
		</div>
	</div>
</div>
	`,thumb:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAAA7DgAAOw4BzLahgwAAAAd0SU1FB+oJGgkYKh/OLc4AAAF2SURBVDjLldK/axRhEMbxz+0ty4EgFiZ4iChnBBHUqFdIEKyEVGJhZymoneBfoKWlhY29nRoQOREUBE2IjU0UFBU9SRPSeFHPZM/btViT+7EbLz7VCzPfmWdmXv5TpY1X4Iq67lA89spJ9z3LAxX3vLYgGAKqbmu62EN6wANTBR7O6kh9dHrdSL/KBUCghP3uqOeBIsV+icVqWY9wJDDnnFDikA9bA779HfeoSY2tWFpXlE3YAzra4tFcZqmmruyLSXv7LpNp1XOtYeC8mxJp4Vpbps0PAyECTwTe2mPCjGMqIj8dNj5Ypn9Lj7332WV37XPLmpYdbthVNAOs+eG4MY98d9UnS9q+5k2GffWbJiw7aMx1NQdUvVCRFgEBzjhluwvGRRbtlApdsk1ncG8Z8M5LlHWVNKUCzY2MFct5YEZD5JqH3uRun1rNA11tXUc8HQwWqVevJPH7H5lJ/g6Rabs3+Y6JExYGgVhDXXXTDitmR9kt1B96G13n8KBxCAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wOS0yNlQwOToyNDo0MiswMDowMOJEVAwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDktMjZUMDk6MjQ6NDIrMDA6MDCTGeywAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA5LTI2VDA5OjI0OjQyKzAwOjAwxAzNbwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=`});export{t as data};
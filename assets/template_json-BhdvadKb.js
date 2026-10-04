import{t as e}from"./index-Cy7Q1s8J.js";var t=e({title:`JSON`,lang:`EN`,schema:[{key:`col1`,type:`string`},{key:`col2`,type:`string`},{key:`col3`,type:`string`},{key:`col4`,type:`array`,items:{key:`item`,type:`object`,children:[{key:`child1`,type:`string`},{key:`child2`,type:`string`}]}}],data:[{col1:`row 1 col 1`,col2:`row 1 col 2`,col3:`row 1 col 3`,col4:[{child1:`row 1 col 4 list 1 child 1`,child2:`row 1 col 4 list 1 child 2`},{child1:`row 1 col 4 list 2 child 1`,child2:`row 1 col 4 list 2 child 2`},{child1:`row 1 col 4 list 3 child 1`,child2:`row 1 col 4 list 3 child 2`}]},{col1:`row 2 col 1`,col2:`row 2 col 2`,col3:`row 2 col 3`,col4:[{child1:`row 2 col 4 list 1 child 1`,child2:`row 2 col 4 list 1 child 2`},{child1:`row 2 col 4 list 2 child 1`,child2:`row 2 col 4 list 2 child 2`},{child1:`row 2 col 4 list 3 child 1`,child2:`row 2 col 4 list 3 child 2`}]},{col1:`row 3 col 1`,col2:`row 3 col 2`,col3:`row 3 col 3`,col4:[{child1:`row 3 col 4 list 1 child 1`,child2:`row 3 col 4 list 1 child 2`},{child1:`row 3 col 4 list 2 child 1`,child2:`row 3 col 4 list 2 child 2`},{child1:`row 3 col 4 list 3 child 1`,child2:`row 3 col 4 list 3 child 2`}]}],abbr:{long:`short`},asset:{"text-1":`text-1`},template:`<div class="page a4 page-m-[15mm] font-sans" contenteditable="true">
	<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
	<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
	<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	<div>Col4 : 
		<div class="flex flex-col gap-2 py-1">
		{{#loop col4}}
			<div class="flex gap-2">
				<span class="bg-gray-200">{{child1}}</span>
				<span class="bg-gray-200">{{child2}}</span>
			</div>
		{{/loop col4}}
		</div>
	</div>
</div>
	`,thumb:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB20lEQVRIibXVy0tVURQG8F8it4tIhEgDR0KDIIIaGEQFEUH+AdKkURQUERENKggqQgwJG0VNokFQsybR2B6OIiLEwKgIQbsmQQ57Wdpgr4OHw/V27uW2YLEfa6/v22c9zoY7+NOkDisp6zCHBTwucX49LuIHxnCpDEkNt0peqBsrOI4PuPwvh86SwEX5hP14jt+41m6CPMlTLGO0HQTLMfaG7zwGMR626/WcmskB6cYra+i24uFWQjSI3ejK7e3ACKrtIPiFZ3X26kpHCwRNyX8nyIdoAx5gaws4WT4eSV1OCtswq1V02NrV0ap+zIeoWAGjOIdFDGE7zobtBQ5gJ25LPbAP9/El5rOoNsrBW0zhoVQ1V6TGmg/CTTiEU3iNCZyROnwC3yiX5IMBNhTgizGexHkp/pNxtoILeed6fTCGnrhBF6ZxAruwJ25bwXv0S0ntDd8RnC4CZkk+KiXmRnxZB+5Jv4aqVF19+IyrYa9gL74H1niQkEJcyxMcsZr9GekhytZf8SaAsr0a3kkvXLb+iaWYL2EuH6KXubD0F76yJzQvfQ3W2fxJnmAam+uAl5EB3MSxwCE12mQxyQuhzUp3jFN4lTd0Sk0yID3mrcqWRsa72vRbwMYi+F808qmBCJ0OfwAAAABJRU5ErkJggg==`});export{t as data};
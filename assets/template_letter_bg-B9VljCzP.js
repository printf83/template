const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/company-logo-BDkxSzJX.js","assets/company-logo-D0_PrBOp.js"])))=>i.map(i=>d[i]);
import{v as e}from"./vendor-jspdf-BoJr6Bg9.js";import{t}from"./data-CyYrSiqu.js";async function n(){return(await e(()=>import(`./company-logo-BDkxSzJX.js`),__vite__mapDeps([0,1]))).default}async function r(){return(await e(()=>import(`./letter-bg-BULABUwD.js`),[])).default}var i=t({title:`Letter Background`,lang:`EN`,schema:[{key:`col1`,type:`string`},{key:`col2`,type:`string`},{key:`col3`,type:`string`}],data:[{col1:`row 1 col 1`,col2:`row 1 col 2`,col3:`row 1 col 3`},{col1:`row 2 col 1`,col2:`row 2 col 2`,col3:`row 2 col 3`},{col1:`row 3 col 1`,col2:`row 3 col 2`,col3:`row 3 col 3`}],template:`<div class="page a4 page-mx-[15mm] page-mt-[10mm] font-sans relative asset-[bg] bg-cover bg-center" contenteditable="true">
	{{#asset letter-head}}
	<div class="h-[222mm]">
		<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
		<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
		<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	</div>
	{{#asset letter-foot}}
</div>`,style:``,script:``,abbr:{long:`short`},asset:{"company-name":`COMPANY NAME`,"company-reg":`A10000-B`,"company-address":`No 123-130, Tech Park,
Jalan Mat Salleh,
88100 Kota Kinabalu, Sabah`,"company-phone":`+6 000 000 0000`,"company-fax":`+6 000 000 0000`,"company-email":`admin@example.com`,"letter-head":`<div class="flex flex-row justify-between gap-3 border-b pb-2 mb-5">
	<div class="flex flex-col">
		<h1 class="text-3xl font-bold text-shadow text-blue-900/80">{{#asset company-name}}</h1>
		<p class="text-sm">{{%br #asset company-address}}</p>
		<p class="text-sm">
			Tel : <b>{{#asset company-phone}}</b> | 
			Fax : <b>{{#asset company-fax}}</b> | 
			Email : <b>{{#asset company-email}}</b>
		</p>
	</div>
	<div class="w-32 h-32 p-2 flex">
		<div class="w-full h-full bg-contain bg-center bg-no-repeat asset-[company-logo]"></div>
	</div>
</div>`,"letter-foot":`<div class="text-xs flex flex-col items-center justify-center border-t pt-2 mt-5">
	<p class="text-blue-900/80 font-bold">{{#asset company-name}}</p>
	<p>Reg No : <b>{{#asset company-reg}}</b></p>
</div>`,"company-logo":await n(),bg:await r()},thumb:`data:image/webp;base64,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`});export{i as data};
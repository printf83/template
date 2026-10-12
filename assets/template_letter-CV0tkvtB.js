const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/company-logo-BDkxSzJX.js","assets/company-logo-D0_PrBOp.js"])))=>i.map(i=>d[i]);
import{v as e}from"./vendor-jspdf-BoJr6Bg9.js";import{t}from"./data-CyYrSiqu.js";async function n(){return(await e(()=>import(`./company-logo-BDkxSzJX.js`),__vite__mapDeps([0,1]))).default}var r=t({title:`Letter`,lang:`EN`,schema:[{key:`col1`,type:`string`},{key:`col2`,type:`string`},{key:`col3`,type:`string`}],data:[{col1:`row 1 col 1`,col2:`row 1 col 2`,col3:`row 1 col 3`},{col1:`row 2 col 1`,col2:`row 2 col 2`,col3:`row 2 col 3`},{col1:`row 3 col 1`,col2:`row 3 col 2`,col3:`row 3 col 3`}],abbr:{long:`short`},asset:{"company-name":`COMPANY NAME`,"company-reg":`A10000-B`,"company-address":`No 123-130, Tech Park,
Jalan Mat Salleh,
88100 Kota Kinabalu, Sabah`,"company-phone":`+6 000 000 0000`,"company-fax":`+6 000 000 0000`,"company-email":`admin@example.com`,"letter-head":`<div class="flex flex-row gap-3 border-b pb-2 mb-5">
	<div class="w-32 h-32 p-2 flex">
		<div class="w-full h-full bg-contain bg-center bg-no-repeat asset-[company-logo]"></div>
	</div>
	<div class="flex flex-col">
		<h1 class="text-3xl font-bold text-shadow text-blue-900/80">{{#asset company-name}}</h1>
		<p class="text-sm">{{%br #asset company-address}}</p>
		<p class="text-sm">
			Tel : <b>{{#asset company-phone}}</b> | 
			Fax : <b>{{#asset company-fax}}</b> | 
			Email : <b>{{#asset company-email}}</b>
		</p>
	</div>
</div>`,"letter-foot":`<div class="text-xs flex flex-col items-center justify-center border-t pt-2 mt-5">
	<p class="text-blue-900/80 font-bold">{{#asset company-name}}</p>
	<p>Reg No : <b>{{#asset company-reg}}</b></p>
</div>`,"company-logo":await n()},template:`<div class="page a4 page-mx-[15mm] page-mt-[10mm] font-sans relative" contenteditable="true">
	{{#asset letter-head}}
	<div class="h-[222mm]">
		<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
		<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
		<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	</div>
	{{#asset letter-foot}}
</div>
	`,thumb:`data:image/webp;base64,UklGRmYFAABXRUJQVlA4WAoAAAAwAAAAVAAAdwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZBTFBIHwAAAAEP0P+ICJhpmKaZAfybhQsU7Ijo/wSwOl3H+PA4XawAVlA4IFADAABQFACdASpVAHgAPhkMhUGhBG5nKgQAYSzhQ88iV7pLwAH6q9aJ+0f7Aexrq2SYHQLIm/xfCDrwfkzwBWH+Bx864gO4k4gaOD/gfbN8Xec16G/7HuCfy7+vf8vr4ekAEEU4/0sB8F7HXT9Tt9uIqi3fW8K2LEoDR6J7WHVjmB63bm6gJK5ggMA+gXI7ON+iItlJnRfoiLYX+u6DuUU7Xw/nRqE+EgAvXOaTcAAA/v//pQ523Hn7ott2zNNgRm4Fm/JGnhBvP//nMWrneGvADSlAMu55/x3z+NMDpF5FXsKptTm+zLMd42J/hAaB3y5HwrEvsuzHu7I4ciL9O/ybe7M+/+Cf1eaZk76Pr/BfMczjwuq78FJG7kf+qZhOKSj8s410eexP+c9iH2s24lseREfoq/M1gegbYaohjfAQ/5jkTjsqVSC/SsE/0pjKyQMs2B/y596JwLlEDS8jRSxmr/AknP/05GP9fg0bCI6ewKbihfYxQLHqXO2G9Dbj3MMtKghvU0VPdZ91mu9YmtxwVZF6OEf9sR/8iv1lb+V3/K7gAgrNcPJVpdwk395pz/ybB/ZwLH6zHGEe7axsmaL2lOawA+906d6E3PChYpUv/RNPHhz8j1xYdRNzEWwXE61vdB/VwPfYagHQqZEzzeX+XWD1vOt/q8lxedjlcJh3Y59XP/tmhkHHpyikEZZqrx0nOJTVyEQ39Y1k/YVQWqPE/7C/4ndxk41aeB5t9zoq5fk7JbmCie9yZ4Hq4GGO2zy1UiNzsOz1hlGna6rP52D8XCXfVVAOIOvbFLBIumE4IG4eYLoxi2B2dmJvYZwsW0QO7yRgVOtgP48SOW1bwFbPn8T7ems8cAf9sTF4OC9+f56rPa4xh2wqxvKiieS/IGY5NoudLbqcHe/Vj+LcK5ZJSjmtUKCw0+mvcNcrW2IOClCWNjpHX1/+heYPhIP01gAIYB+bGQzGNVO1JZa958AhcDobV85EjyIMyqEu1o1hXm89zSGvNxLZXzclCWXjAF+siHTbCG3jMm5pT1qg+KXjBWYAACMhfZEkMGaq26nzEafqm1qm+uWGS8aT+GRWIFhiQ4UMdcadk+mRarOkggZGkGPKHqhtIPny26y4UYGqolqAAA==`});export{r as data};
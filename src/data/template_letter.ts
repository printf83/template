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
	short: {
		long: "short",
	},
	asset: {
		"company-name": "COMPANY NAME",
		"company-reg": "A10000-B",
		"company-address": `No 123-130, Tech Park,<br/>Jalan Mat Salleh,<br/>88100 Kota Kinabalu, Sabah`,
		"company-phone": "+6 000 000 0000",
		"company-fax": "+6 000 000 0000",
		"company-email": "admin@example.com",
		"letter-head": `<div class="flex flex-row gap-3 border-b pb-2 mb-5">
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
		</div>`,
		"letter-foot": `<div class="text-xs flex flex-col items-center justify-center border-t pt-2 mt-5">
			<p class="text-indigo-600 font-semibold">{{#asset company-name}}</p>
			<p>Reg No : <b>{{#asset company-reg}}</b></p>
		</div>`,
		"company-logo":
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAuCAMAAABZAGpeAAABoVBMVEVHcEyKPP+JJ/+ON/97dP9/Qf98TP9eiP+AP/9akP9xZf92ef+OQf+NP/+GJf+OPf98Sv9yZv+MMv+MPf+LPv+URP+KLv9thP97VP+BV/+EP/+KQ/+LOP+CR/9mgP90Y/9jh/9mgf+MNv9pef9cjP9oe/+KPP9tb/99Uf+TRf+DRv+HXf+KLf9eiv93c/9cjf+NNf+GJP+EXf9tcv9jfv+PPf93bv95U/+DVf+FTv9yX/+TQf+URf97Uf+ER/9bkP+CTf9ifv+QOv9oeP9pa/+EQP+HW/9sZ/96cP+ZVv+aWf+aWP+WSP+RP/+TT/+YT/+VU/+WVf+QPP+QTP+ZU/+TQv95T/+XV/+XWf+NRP+TRf+LQv+XTP+UW/+QSf+SVf9taf+IVP+POP94V/+NRv+ZUf+QUv+OVf+RXv+LYv+CUv97Sv9kef+CV/9vY/+ETP9ggf9pcf+SV/+OWv96VP+MQP+TTP+NSP+BbP+HZv+Faf9xX/+MXv+KUP9xWP96Xf+NM/91W/9/R/9pbv9yfv9mdP+IKP9+cP9iff+EIf+FRv8XkEjWAAAAinRSTlMADAHI/vI7/jf9/v3aGamr9BOpLETL//4IOgR5DzRgjeZ7Y9P+tVgt9Izw6HKgpsWT0rshOexL4fNOagb1xSLdpI3oSe33y0vA//////////////////////////////////////////////////////////////////////////7///////////4llmd2AAADQ0lEQVRIx5WUZ1caURCGFzUaFCQJdrEbu7EmdtMLLCu7tKUJKkUFFKWqYAS7/urM3F0S3fUYeDmHT89zZu7s3EtRxWhVKfe/OJ2BjMUSCm0ncrnd45Ojo3ct1OMoNKkUAYUE/vKI31RV/VJIhPZUinCBTAD/Ml7k44S/qaq7rPsg4Rvep9zOgFdMxuu1rK2FfIkdkW/uqXjMqyvNjNPlTUMsYoCP7+R2T46Qf/v6Md8yiXw6vfYgrC++LhS4bO4elDTUa2ZsLmPaFGRZjmUFngMeBFKgU8JrVWbgPSbWauUwLITjeBRIR9KR6jSkgMdkter1esHheN5RFPpmpBM1M4zNaDQFkcdwvJ5HAc8A30A+UYZhXEaoEAxaraJB8w5BODnqkk60kcEKaHhM6BCFpg1gwFiPpyUTXRq2ocDYbC7REQzgoUQuN9oqnegyCCREQgUMWm/ACuuJ3A/pDqlcNmZLCEri4QXBEU8kRrUSYbixsfJBVDjeIB7BQDv4OBjTC62trdViOhRUheJR1MMuI/RkMGAFHozt7c35+aGhoVckI+2UNOpGFGgUaBB8IGyGw3a7PQKJxeSCThTgB4KvKKAC+aSTCQPLHhMWoA3wsbmikEwm/ZCVVRmvVRk9QdIRzcNGCcKe318oZLPZuWoZr9DYoCOB5zmW8Ht7Z2fZ/dqNjdpFGU+NMa5iAdhyX0jkAb84POxqk/ENXxj4bnqhIZYNhU4JD/hVNCq9psLNFjuChgR+k/CH0duDvkEZ3za5RQRYDNhwNnR6ehre8xP+oKb7q/wAA/k8CB64FFa4o4QP+wv7hO/vkfPaqaa8mcFdMpngFbBYQEgWsoRXjrfIJ1p/3ZTfQsNoJK9TLBZO+gu1F1fAT8gPXDF2dy0YeJXg8cugAA1d3dYoP87KG9JN3REjD/eCYeCVvY/Fkn7SkFLZKeepit56zBuMRqNyu+/P7VDgInrQr5Q+rEXlQdQa933EDgWwoXEF9f80fD+PiAUmZkrgqZcvQIAT3NZ0z1IlCvbf0NFBTSdVuoAdfW4rVYgQ4YkVfVZ4YkWfFb79pMoTFqnyhK6W0oWOkXP7ipoqS5jrKIOnVlUjA+Xw1FLDwtNf7A94GWvHW01PAQAAAABJRU5ErkJggg==",
	},
	template: `<div class="page a4 page-mx-[15mm] page-mt-[10mm] relative" contenteditable="true">
	{{#asset letter-head}}
	<div class="h-[225mm]">
		<div>Col1 : <span class="font-semibold">{{col1}}</span></div>
		<div>Col2 : <span class="font-semibold">{{col2}}</span></div>
		<div>Col3 : <span class="font-semibold">{{col3}}</span></div>
	</div>
	{{#asset letter-foot}}
</div>
	`,
	thumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABNklEQVRIS+3VzSpFURjG8Z+JG0AUMVJyCQY+EjdAyX3IDZgp92BoZK4UKZcgmVBK+RqZGtBi7dX27nNy9olM/Cdnr3e/z/Osvc6qd8AvM1CePhnDLlYxWqqdecU+tvBSqoEYcICNsuqNSyzisVRqxIBnDGEBZ6Xa5C3/3mISV1nzkOuFGFAJYz1S9U3gHFO4xjzu8rsPolHbgNQ3jhNM4wZzuM/vG0b9BCTShTjFDA6xlusNoyjsxgVmy+or6XYNVotoFAPSp6cbkkg7XMrP69jJO+5E8e03oBtR/21AWxr6aNRoaElDH41iQ/2IulE/uqj/+4C2tP6CtjT00Sg2/P8H3x5RWxr6aPSE4R4GTieWcZyH1khVjAH9jMxI8tisFjEgDf09rNR30SNpXB5huz46Y8CP8w5IlEwZQXee/QAAABBkZUJHREVGQTI0RUY4Q0I3Nzk0MUi2PYoAAAAASUVORK5CYII=",
});

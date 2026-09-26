import { createData } from "./data";

export const data = createData({
	title: "Asset",
	lang: "EN",
	schema: [
		{ key: "id", type: "number" },
		{ key: "name", type: "string" },
	],
	data: [
		{
			id: 1,
			name: "Ahmad Firdaus bin Zamri",
		},
		{
			id: 2,
			name: "Nurul Aisyah binti Mansor",
		},
		{
			id: 3,
			name: "Muhammad Khairul bin Azman",
		},
		{
			id: 4,
			name: "Siti Aminah binti Razali",
		},
		{
			id: 5,
			name: "Mohd Syazwan bin Bakri",
		},
	],
	short: {
		executive: "exc",
		manager: "mgr",
		engineer: "eng",
	},
	asset: {
		company: "COMPANY <span class='italic underline'>NAME</span>",
		logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAuCAMAAABZAGpeAAABoVBMVEVHcEyKPP+JJ/+ON/97dP9/Qf98TP9eiP+AP/9akP9xZf92ef+OQf+NP/+GJf+OPf98Sv9yZv+MMv+MPf+LPv+URP+KLv9thP97VP+BV/+EP/+KQ/+LOP+CR/9mgP90Y/9jh/9mgf+MNv9pef9cjP9oe/+KPP9tb/99Uf+TRf+DRv+HXf+KLf9eiv93c/9cjf+NNf+GJP+EXf9tcv9jfv+PPf93bv95U/+DVf+FTv9yX/+TQf+URf97Uf+ER/9bkP+CTf9ifv+QOv9oeP9pa/+EQP+HW/9sZ/96cP+ZVv+aWf+aWP+WSP+RP/+TT/+YT/+VU/+WVf+QPP+QTP+ZU/+TQv95T/+XV/+XWf+NRP+TRf+LQv+XTP+UW/+QSf+SVf9taf+IVP+POP94V/+NRv+ZUf+QUv+OVf+RXv+LYv+CUv97Sv9kef+CV/9vY/+ETP9ggf9pcf+SV/+OWv96VP+MQP+TTP+NSP+BbP+HZv+Faf9xX/+MXv+KUP9xWP96Xf+NM/91W/9/R/9pbv9yfv9mdP+IKP9+cP9iff+EIf+FRv8XkEjWAAAAinRSTlMADAHI/vI7/jf9/v3aGamr9BOpLETL//4IOgR5DzRgjeZ7Y9P+tVgt9Izw6HKgpsWT0rshOexL4fNOagb1xSLdpI3oSe33y0vA//////////////////////////////////////////////////////////////////////////7///////////4llmd2AAADQ0lEQVRIx5WUZ1caURCGFzUaFCQJdrEbu7EmdtMLLCu7tKUJKkUFFKWqYAS7/urM3F0S3fUYeDmHT89zZu7s3EtRxWhVKfe/OJ2BjMUSCm0ncrnd45Ojo3ct1OMoNKkUAYUE/vKI31RV/VJIhPZUinCBTAD/Ml7k44S/qaq7rPsg4Rvep9zOgFdMxuu1rK2FfIkdkW/uqXjMqyvNjNPlTUMsYoCP7+R2T46Qf/v6Md8yiXw6vfYgrC++LhS4bO4elDTUa2ZsLmPaFGRZjmUFngMeBFKgU8JrVWbgPSbWauUwLITjeBRIR9KR6jSkgMdkter1esHheN5RFPpmpBM1M4zNaDQFkcdwvJ5HAc8A30A+UYZhXEaoEAxaraJB8w5BODnqkk60kcEKaHhM6BCFpg1gwFiPpyUTXRq2ocDYbC7REQzgoUQuN9oqnegyCCREQgUMWm/ACuuJ3A/pDqlcNmZLCEri4QXBEU8kRrUSYbixsfJBVDjeIB7BQDv4OBjTC62trdViOhRUheJR1MMuI/RkMGAFHozt7c35+aGhoVckI+2UNOpGFGgUaBB8IGyGw3a7PQKJxeSCThTgB4KvKKAC+aSTCQPLHhMWoA3wsbmikEwm/ZCVVRmvVRk9QdIRzcNGCcKe318oZLPZuWoZr9DYoCOB5zmW8Ht7Z2fZ/dqNjdpFGU+NMa5iAdhyX0jkAb84POxqk/ENXxj4bnqhIZYNhU4JD/hVNCq9psLNFjuChgR+k/CH0duDvkEZ3za5RQRYDNhwNnR6ehre8xP+oKb7q/wAA/k8CB64FFa4o4QP+wv7hO/vkfPaqaa8mcFdMpngFbBYQEgWsoRXjrfIJ1p/3ZTfQsNoJK9TLBZO+gu1F1fAT8gPXDF2dy0YeJXg8cugAA1d3dYoP87KG9JN3REjD/eCYeCVvY/Fkn7SkFLZKeepit56zBuMRqNyu+/P7VDgInrQr5Q+rEXlQdQa933EDgWwoXEF9f80fD+PiAUmZkrgqZcvQIAT3NZ0z1IlCvbf0NFBTSdVuoAdfW4rVYgQ4YkVfVZ4YkWfFb79pMoTFqnyhK6W0oWOkXP7ipoqS5jrKIOnVlUjA+Xw1FLDwtNf7A94GWvHW01PAQAAAABJRU5ErkJggg==",
	},
	template: `<div class="page a4 page-m-[15mm]" contenteditable="true">
	<div>ID : <span class="font-semibold">{{id}}</span></div>
	<div>Name : <span class="font-semibold">{{name}}</span></div>
	<div>Company : <span class="font-semibold">{{#asset company}}</span></div>
	<div>Company Logo :
		<div class="asset-[logo] w-24 h-24 bg-cover bg-center bg-no-repeat"></div>
	</div>
</div>
	`,
	thumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAB70lEQVRIS93VS6hNcRTH8c8NiTBQjBSRISkD5gZCBiYGJpQy8kqhPPJ+5RlmikwMjIWJMQMihkqUEjFQ5FXod+86p3O3c+513e7Ed7TW+q+9f/u/9n+tf58xpq9tDc1kbMWG8q/iIr6W35PhBLK+Dicxqx0d4DV240Y70oWhBJbiApaU/xTby058Ydn3sQWPyh9EN4F8ab44X571t9hbZflVOYlvxDHMrHh2shNvKqefpkASDmESvuM8juBzO2MwU3EA2zAeX7AfZ1sJnQJ3sbzsm9iFV+UPx1ycwZryb2NVjE6BD5he9gNs7lXXLizG5fpv4T1mxOgUaNX3HpaVf71Oyrtaa5L6n8L6elfr2dD/7m4Cia2uOs7HJxzHOXyrnInYgT2Ygufl32q8p6dAmFDHLz9xGl7WIQinMQcfcRiX8KPW/lqgRWp5FJvakYHcK3V8U+9ORizQYhEel50me1Z2k38WCCPO+b8EckpmYyXu1DabDFeiFdXFLzAvgc7EnJScitBrVPQSyKg4gbXlH6yZ9kdiGmdfx7DLfEmTtYZdUyD9keGWMd4adumb9Ek/TYHQbVxH+Bp+Vs64GtfZ9YjGdSfNC+dJ9UJIDywoOxdOrtOH5Q9iKIGQ9TG7MjvJpZ/xnfqGXELZ3agv/VHzG9kgdRlpBokyAAAAEGRlQkdDRUNBQjg1OUI0OTMxOEIxGxnimQAAAABJRU5ErkJggg==",
});

import{t as e}from"./index-xAbL4LCn.js";var t=e({title:`Function`,lang:`EN`,schema:[{key:`id`,type:`number`},{key:`name`,type:`string`},{key:`nric`,type:`string`},{key:`job`,type:`string`},{key:`salary`,type:`number`},{key:`weight`,type:`number`}],data:[{id:1,name:`Ahmad Firdaus bin Zamri`,nric:`931015145633`,job:`Software Engineer`,salary:6500,weight:72.5},{id:2,name:`Nurul Aisyah binti Mansor`,nric:`960422105844`,job:`Accountant`,salary:5200,weight:55.2},{id:3,name:`Muhammad Khairul bin Azman`,nric:`891102086315`,job:`Project Manager`,salary:8500,weight:80.1},{id:4,name:`Siti Aminah binti Razali`,nric:`010708035296`,job:`Data Analyst`,salary:4800,weight:61.8},{id:5,name:`Mohd Syazwan bin Bakri`,nric:`950213115477`,job:`Marketing Executive`,salary:4300,weight:68.4}],short:{executive:`exc`,manager:`mgr`,engineer:`eng`},asset:{"file-1":``},template:`<div class="page a4 page-m-[15mm]" contenteditable="true">
	<div>ID : <span class="font-semibold">{{id}}</span></div>
	<div>Name : <span class="font-semibold">{{name}}</span></div>
	<div>Nric : <span class="font-semibold">{{%nric nric}}</span></div>
	<div class="flex gap-2">Age : 
		<span class="font-semibold">{{%age nric}} yo</span>
		<span class="italic">({{%titlecase %number_text %age nric}} Years Old)</span>
	</div>
	<div>Sex : <span class="font-semibold">{{%sex nric}}</span></div>
	<div>Nationality : <span class="font-semibold">{{%nationality nric}}</span></div>
	<div>Job : <span class="font-semibold">{{%short job}}</span></div>
	<div class="flex gap-2">Salary : 
		<span class="font-semibold">MYR {{%money salary}}</span>
		<span class="italic">(Malaysian Ringgit {{%titlecase %money_text salary}} Only)</span>
	</div>
	<div class="flex gap-2">Weight : 
		<span class="font-semibold">{{%number weight}} Kg</span>
		<span class="italic">({{%titlecase %number_text weight}} Kilogram)</span>
	</div>
</div>
	`,thumb:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABkklEQVRIS9XUz4tPURjH8ddko4jFRBayIBnZmERI+VF+7CwUsZgyKAsbK/4CRZKyImwsKJJsUAopFhQ7jZKNlJLYKL91xuOZKffe75kyyXt1n895uu97z33O7TPJ9OXVJPFPBHNwDJvwHmdwIh9pgjS9wSXsyOoXB3EyqwnQJHiLfqzFVFzFNKzGw+yqpElwF1+wMeqtuIZHWBFZNU2CJh5gFXbhYqYV1Aq24QqeYjDTCmoFU/AOM2LLrudKD2oF8/E8ROexJ1d6UCsoH75MVeEV5uFH1J3UCHbHU7+JEV6CDbiTHR30EpTz8AIzY+8X4jjOYl92ddBL8PtUX8Z2zMZrfAx5OS+ddAnKv+gWPmBRbFHhBrZgCBcia6VNMB3PMBd7cS5XWIP7GMFApi20CU7hAO5hXaZj3MRm7MfpyErvd6yPepQmwcr4NXzGYrzMlTGW4gk+xcf/itsxZbOyq0XwGMtwGEcz/ZPhmKbx9yhDsTOrFkGZ7zKWy/Et02bK4TuCBbFth8YNwyhNgr/K/y/4CegXQxnkRwItAAAAEGRlQkdGREZBMzk3QTMwOEU0NTNBHasAnAAAAABJRU5ErkJggg==`});export{t as data};
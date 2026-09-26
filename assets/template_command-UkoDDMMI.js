import{t as e}from"./index-Cp5wnoz1.js";var t=e({title:`Command`,lang:`EN`,schema:[{key:`id`,type:`number`},{key:`name`,type:`string`},{key:`nric`,type:`string`},{key:`job`,type:`string`},{key:`salary`,type:`number`},{key:`weight`,type:`number`}],data:[{id:1,name:`Ahmad Firdaus bin Zamri`,nric:`931015145633`,job:`Software Engineer`,salary:6500,weight:72.5},{id:2,name:`Nurul Aisyah binti Mansor`,nric:`960422105844`,job:`Accountant`,salary:5200,weight:55.2},{id:3,name:`Muhammad Khairul bin Azman`,nric:`891102086315`,job:`Project Manager`,salary:8500,weight:80.1},{id:4,name:`Siti Aminah binti Razali`,nric:`010708035296`,job:`Data Analyst`,salary:4800,weight:61.8},{id:5,name:`Mohd Syazwan bin Bakri`,nric:`950213115477`,job:`Marketing Executive`,salary:4300,weight:68.4}],short:{executive:`exc`,manager:`mgr`,engineer:`eng`},asset:{"file-1":``},template:`
	<div class="page a4 page-m-[15mm]" contenteditable="true">
        <div>ID : <span class="font-semibold">{{id}}</span></div>
		<div>Name : <span class="font-semibold">{{name}}</span></div>
		<div>Nric : <span class="font-semibold">{{%nric nric}}</span></div>
		<div>Age : <span class="font-semibold">{{%age nric}} Years Old</span></div>
		<div>Sex : <span class="font-semibold">{{%sex nric}}</span></div>
		<div>Nationality : <span class="font-semibold">{{%nationality nric}}</span></div>
		<div>Job : <span class="font-semibold">{{%short job}}</span></div>
		<div class="flex gap-2">Salary : 
			<span class="font-semibold">MYR {{%money salary}}</span>
			<span class="font-semibold">(Malaysian Ringgit {{%money_text salary}} Only)</span>
		</div>
		<div class="flex gap-2">Weight : 
			<span class="font-semibold">{{%number weight}} Kg</span>
			<span class="font-semibold">({{%number_text weight}} Kilogram)</span>
		</div>
    </div>
	`,thumb:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAlwSFlzAABYlQAAWJUB2W030wAAAAd0SU1FB+oJGgkXMRIz+O0AAAGRSURBVDjLndSxSlthFAfwX24SzB0MRRAko0JDKH0Bhw4S6GAhQ0aH7q5CnsEnUHDr4AMIdmgGAxl8gVLCLdQlGAQ71Cpc5SZ8HXq5NCkI8ZzpnO//5/vO/5zzQV1PIvOgr23R2voeZBI9dag7lgm5X+vOwbuui7PMsTo9mWDgwKGxILFVwLckgrFDBwaCTI9EMLABOu4E+wVhX3CnAzYMBElkE+duwIURmgWhiZELcOMcm5EnrOeAqRTVglBFappH63iKXGJPx6pYrIyKmlispoKyWGxVxx4uS9o+afhtJFX21isT35UQvNbwy1czsZa6iY9/pUsK6Z7zRJdSLt97TVUVuxq+GeavfueNic+mMokvfix2tWYgOCriI8FA7V9INEco5Tc+k4ssafOEIPyHWMi9qOglZV26cX3BOB+NNUPBSTEaJ4KhtXw0xoJ+ZBunztxLpWaYepRKPZpiJpW6d+YU25EV3OZFVsTICkkyxCp59BMrkSt8yBdoRwtJQUjQspMv0C6uXrCiS38CS34zfwD6q+Ip5c11jAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wOS0yNlQwOToyMzo0OSswMDowMAKfG48AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDktMjZUMDk6MjM6NDkrMDA6MDBzwqMzAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA5LTI2VDA5OjIzOjQ5KzAwOjAwJNeC7AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=`});export{t as data};
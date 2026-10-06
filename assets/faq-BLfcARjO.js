var e=`<div class="faq-container">\r
	<!-- Category 1: Printing & Performance -->\r
	<h3>Printing & Performance</h3>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>How does the print time estimation work?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			The engine automatically tracks how fast your device renders pages\r
			and stores this historical performance data locally in your\r
			browser's Cache API. It uses this data to compute a running average\r
			per page and accurately estimate processing times for future print\r
			jobs.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Why do I see a "Continue Printing?" warning modal?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			When a document contains many pages or is calculated to take longer\r
			than 5 seconds to generate, the system displays a warning dialog to\r
			prevent accidental browser tab freezes and allow you to confirm\r
			before processing begins.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>How can I reset my stored print performance statistics?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			Your print performance metrics (like total print speed and total\r
			page count) are stored locally in your browser cache. Clearing your\r
			browser's site data or executing <code>db.clear()</code> will reset\r
			these calculations back to factory defaults.\r
		</p>\r
	</details>\r
\r
	<!-- Category 2: Template Logic & Expression Engine -->\r
	<h3>Template Expressions</h3>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>How do piped template expression helpers work?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			You can chain multiple transformation helpers together using the\r
			<code>%</code> prefix inside standard handlebars syntax. For\r
			example, <code>{{ %uppercase %money_text total }}</code> will first\r
			format the value as currency and then convert the entire string to\r
			uppercase.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Are template helper transformations case-sensitive?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			Transformers like the <code>abbr</code> text formatter automatically\r
			preserve letter casing (Title Case, UPPERCASE, or lowercase) based\r
			on how you enter the property key in your dictionary schema.\r
		</p>\r
	</details>\r
\r
	<!-- Category 3: Files & Clipboard Handling -->\r
	<h3>Files & Clipboard</h3>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>What happens when I click "Copy File"?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			Selecting a file converts code and data files (JSON, CSV, HTML) into\r
			plain text, and converts images into Base64 Data URLs. It then\r
			writes the output directly to your operating system clipboard so you\r
			can paste it into external applications like VS Code or Notepad.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>What happens if I upload or copy a large file?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			Files larger than <strong>10 MB</strong> trigger a warning dialog\r
			before processing. While you can choose to proceed, processing very\r
			large files (especially memory-intensive Base64 images) may\r
			temporarily slow down or freeze your browser tab.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Why did pasting fail after selecting a file?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			Some browsers suppress system clipboard writing if the web page\r
			loses active window focus while the file picker dialog is open. The\r
			application automatically recovers tab focus before executing copy\r
			requests to bypass this browser policy.\r
		</p>\r
	</details>\r
\r
	<!-- Category 4: Security & System Architecture -->\r
	<h3>Security & Offline Support</h3>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Is my document data uploaded to an external server?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			No. All template evaluation, dynamic chunk loading, image\r
			conversions, and PDF generations execute 100% locally inside your\r
			web browser. None of your data is transmitted to external servers.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Does this application work offline?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			Yes. Heavy dependencies (such as CodeMirror, jsPDF, and html2canvas)\r
			are dynamically cached after their first load, allowing document\r
			generation to function smoothly even without an internet connection.\r
		</p>\r
	</details>\r
\r
	<!-- Category: License & Terms -->\r
	<h3>License & Terms</h3>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Under what license is this application provided?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			This software is open-source and released under the\r
			<strong>MIT License</strong>. You are free to use, modify, adapt, or\r
			distribute it for both personal and commercial projects without any\r
			hidden fees or API restrictions.\r
		</p>\r
	</details>\r
\r
	<details name="faq">\r
		<summary>\r
			<span>Does this application come with any warranty?</span>\r
			<span>▼</span>\r
		</summary>\r
		<p>\r
			The software is provided <strong>"as is"</strong> without warranty\r
			of any kind, express or implied. Because all document rendering and\r
			processing execute 100% locally inside your web browser, you\r
			maintain complete ownership and control over your data.\r
		</p>\r
	</details>\r
</div>\r
`;export{e as default};
export function attachBtnPrintAll(
	btn: HTMLButtonElement,
	iframe: HTMLIFrameElement,
) {
	if (btn && iframe) {
		btn.addEventListener("click", () => {
			const iframeWindow = iframe.contentWindow;
			if (iframeWindow) {
				iframeWindow.focus();
				iframeWindow.print();
			}
		});
	}
}

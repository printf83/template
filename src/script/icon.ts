import { createIcons, Printer, Download } from "lucide";

// Replace <i data-lucide="..."> elements with actual SVGs
export const icon = () => {
	createIcons({
		nameAttr: "data-icon",
		icons: {
			Printer,
			Download,
		},
	});
};

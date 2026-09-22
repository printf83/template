import {
	createIcons,
	Printer,
	Download,
	LoaderCircle,
	Settings,
	Save,
} from "lucide";

// Replace <i data-lucide="..."> elements with actual SVGs
export const renderIcons = () => {
	createIcons({
		nameAttr: "data-icon",
		icons: {
			Printer,
			Download,
			LoaderCircle,
			Settings,
			Save,
		},
	});
};

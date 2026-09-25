import {
	createIcons,
	Printer,
	Download,
	Upload,
	LoaderCircle,
	Settings,
	Save,
	FileText,
	Box,
	Database,
	Search,
	CheckCircle,
	SlidersHorizontal,
	Trash,
	FlaskConical,
	Plus,
	File,
	ClipboardCopy,
} from "lucide";

// Replace <i data-icon="..."> elements with actual SVGs
export const renderIcons = () => {
	createIcons({
		nameAttr: "data-icon",
		icons: {
			Printer,
			Download,
			Upload,
			LoaderCircle,
			Settings,
			Save,
			FileText,
			Box,
			Database,
			Search,
			CheckCircle,
			SlidersHorizontal,
			Trash,
			FlaskConical,
			Plus,
			File,
			ClipboardCopy,
		},
	});
};

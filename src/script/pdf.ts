import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";
import { renderIcons } from "./icon";

function setButtonLoading(btn: HTMLButtonElement, isLoading: boolean) {
	const iconEl = btn.querySelector("[data-icon]");
	if (!iconEl) return;

	btn.disabled = isLoading;
	iconEl.setAttribute("data-icon", isLoading ? "loader-circle" : "download");

	// Re-render Lucide icons to swap SVG
	renderIcons();
}

export function attachBtnDownloadPdf(
	btn: HTMLButtonElement,
	iframe: HTMLIFrameElement,
) {
	if (!btn || !iframe) return;

	btn.addEventListener("click", async () => {
		// Access document inside the iframe
		const iframeDoc =
			iframe.contentDocument || iframe.contentWindow?.document;

		if (!iframeDoc) {
			console.error("Cannot access iframe document.");
			return;
		}

		const pages = Array.from(
			iframeDoc.querySelectorAll<HTMLDivElement>(".page"),
		);

		if (pages.length === 0) {
			console.warn("No .page elements found inside iframe.");
			return;
		}

		setButtonLoading(btn, true);

		try {
			await generatePDF(pages);
		} catch (error) {
			console.error("PDF generation failed:", error);
		} finally {
			setButtonLoading(btn, false);
		}
	});
}

const SUPPORTED_FORMATS = [
	"a0",
	"a1",
	"a2",
	"a3",
	"a4",
	"a5",
	"letter",
	"legal",
	"tabloid",
];

function parsePageConfig(element: HTMLElement) {
	const classes = Array.from(element.classList).map((c) => c.toLowerCase());

	let format = "a4";
	let isLandscape = false;

	for (const cls of classes) {
		if (cls.includes("landscape")) {
			isLandscape = true;
		}

		if (cls.includes("portrait")) {
			isLandscape = false;
		}

		// Clean out '-landscape' or '-portrait' to extract base size (e.g. 'a4-landscape' -> 'a4')
		const baseFormat = cls
			.replace("-landscape", "")
			.replace("-portrait", "");

		if (SUPPORTED_FORMATS.includes(baseFormat)) {
			format = baseFormat;
		}
	}

	// Fallback: If landscape wasn't explicitly in class, check aspect ratio dimensions
	if (!isLandscape && element.offsetWidth > element.offsetHeight) {
		isLandscape = true;
	}

	return {
		format,
		orientation: (isLandscape ? "landscape" : "portrait") as
			| "landscape"
			| "portrait",
	};
}

async function generatePDF(pages: HTMLDivElement[], filename = "document.pdf") {
	let pdf: jsPDF | null = null;

	for (let i = 0; i < pages.length; i++) {
		const pageElement = pages[i];

		// Parse format (a4, a3, letter...) and orientation per page
		const { format, orientation } = parsePageConfig(pageElement);

		// Convert page element to Canvas with high resolution (pixelRatio: 2)
		const canvas = await toCanvas(pageElement, {
			pixelRatio: 2,
			cacheBust: true,
		});

		// Best balance of razor-sharp text and small PDF file size
		const imgData = canvas.toDataURL("image/jpeg", 0.95);

		if (i === 0) {
			pdf = new jsPDF({
				orientation: orientation,
				unit: "mm",
				format: format,
			});
		} else if (pdf) {
			pdf.addPage(format, orientation);
		}

		if (pdf) {
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			pdf.addImage(
				imgData,
				"JPEG",
				0,
				0,
				pdfWidth,
				pdfHeight,
				`page-${i}`,
				"FAST",
			);
		}

		// Clean up memory
		canvas.width = 0;
		canvas.height = 0;
	}

	if (pdf) {
		pdf.save(filename);
	}
}

import type { jsPDF } from "jspdf";
import { initIcons } from "./utils";

function setButtonLoading(btn: HTMLButtonElement, isLoading: boolean) {
	const iconEl = btn.querySelector("[data-icon]");
	if (!iconEl) return;

	btn.disabled = isLoading;
	iconEl.setAttribute("data-icon", isLoading ? "loader-circle" : "download");

	// Re-render Lucide icons to swap SVG
	initIcons();
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
	const [{ jsPDF: JS_PDF }, { toJpeg }] = await Promise.all([
		import("jspdf"),
		import("html-to-image"),
	]);

	let pdf: jsPDF | null = null;

	for (let i = 0; i < pages.length; i++) {
		const pageElement = pages[i];

		// Parse format (a4, a3, letter...) and orientation per page
		const { format, orientation } = parsePageConfig(pageElement);

		let imgDataUrl: string | null = null;

		try {
			// 1. Render as JPEG with 80% quality and 1.5x pixel ratio
			imgDataUrl = await toJpeg(pageElement, {
				quality: 1,
				pixelRatio: 2,
				cacheBust: true,
			});
		} catch (e) {
			console.error("Failed to convert page to Image. Skipping page.", e);
		}

		if (i === 0) {
			pdf = new JS_PDF({
				orientation: orientation,
				unit: "mm",
				format: format,
			});
		} else if (pdf) {
			pdf.addPage(format, orientation);
		}

		if (pdf && imgDataUrl) {
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			pdf.addImage(
				imgDataUrl,
				"JPEG",
				0,
				0,
				pdfWidth,
				pdfHeight,
				`page-${i}`,
				"FAST",
			);
		}
	}

	if (pdf) {
		pdf.save(filename);
	}
}

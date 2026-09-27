import { db } from "./db";
import { Modal } from "./modal";

// Define constant threshold in milliseconds (e.g., 5 seconds = 5000ms)
const WARNING_LARGE_PRINT_TIME = 5000;

export async function savePrintSpeed(elapsedTime: number, pagesLength: number) {
	if (pagesLength > 0) {
		// 1. Read existing metrics
		const oldPrintSpeed = (await db.read<number>("total-print-speed")) || 0;
		const oldPrintCount = (await db.read<number>("total-print-count")) || 0;

		const updatedSpeed = Math.floor(oldPrintSpeed + elapsedTime);
		const updatedCount = oldPrintCount + pagesLength;

		// 3. Persist updated values asynchronously
		Promise.all([
			db.write("total-print-speed", updatedSpeed),
			db.write("total-print-count", updatedCount),
		]);
	}
}

async function readPrintSpeed() {
	// 1. Fetch both cache keys concurrently in parallel
	const [rawSpeed, rawCount] = await Promise.all([
		db.read<number>("total-print-speed"),
		db.read<number>("total-print-count"),
	]);

	// 2. Apply default fallbacks
	const totalPrintSpeed = rawSpeed || 300;
	const totalPrintCount = rawCount || 1;

	console.log({
		totalPrintCount,
		totalPrintSpeed,
		currentEstimatedPrintSpeed: Math.floor(
			totalPrintSpeed / totalPrintCount,
		),
	});

	// 3. Compute and return per-page average
	return Math.floor(totalPrintSpeed / totalPrintCount);
}

/**
 * Checks document page count against estimated processing time.
 * Displays a warning modal if processing will take too long.
 * @returns Promise<boolean> - resolves to true if print should proceed, false to abort.
 */
export async function warningLargePrint(
	iframe: HTMLIFrameElement,
): Promise<boolean> {
	if (!iframe) return true;

	const doc = iframe.contentDocument || iframe.contentWindow?.document;
	const pagesLength = doc ? doc.querySelectorAll(".page").length : 0;

	if (pagesLength === 0) return true;

	const estimatePrintSpeed = await readPrintSpeed();
	const currentEstimatedPrintSpeed = pagesLength * estimatePrintSpeed;

	if (currentEstimatedPrintSpeed > WARNING_LARGE_PRINT_TIME) {
		const estimatedSeconds = Math.round(currentEstimatedPrintSpeed / 1000);

		const result = await Modal.show({
			title: "Continue Printing?",
			type: "question",
			body: `This document has <strong>${pagesLength} pages</strong> to process and may take more than <strong>${estimatedSeconds} seconds</strong> to finish.`,
			confirmText: "Yes, continue",
			cancelText: "Cancel",
		});

		// Return true only if user confirmed the modal
		return Boolean(result);
	}

	return true;
}

export function attachBtnPrintAll(
	btn: HTMLButtonElement,
	iframe: HTMLIFrameElement,
) {
	if (btn && iframe) {
		btn.addEventListener("click", async () => {
			// 1. Check for warning threshold before triggering print
			const shouldProceed = await warningLargePrint(iframe);
			if (!shouldProceed) return;

			// 2. Proceed with print execution
			const iframeWindow = iframe.contentWindow;
			if (iframeWindow) {
				iframeWindow.focus();
				iframeWindow.print();
			}
		});
	}
}

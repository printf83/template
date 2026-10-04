// document.addEventListener("DOMContentLoaded", () => {
// 	const pageControlContainer = document.getElementById(
// 		"pageControlContainer",
// 	);
// 	if (!pageControlContainer) return;

// 	pageControlContainer.addEventListener("mouseenter", () => {
// 		pageControlContainer.style.display = "inline-block";
// 	});

// 	document.addEventListener("mouseover", (event) => {
// 		const page = event.target.closest(".page");

// 		if (page && !page.contains(event.relatedTarget)) {
// 			page.classList.add("page-hovered");

// 			const rect = page.getBoundingClientRect();

// 			pageControlContainer.style.top =
// 				rect.top + window.pageYOffset + "px";
// 			pageControlContainer.style.left =
// 				rect.left + window.pageXOffset + "px";
// 			pageControlContainer.style.display = "inline-block";
// 		}
// 	});

// 	document.addEventListener("mouseout", (event) => {
// 		const page = event.target.closest(".page");

// 		if (page && !page.contains(event.relatedTarget)) {
// 			if (!pageControlContainer.contains(event.relatedTarget)) {
// 				page.classList.remove("page-hovered");
// 				pageControlContainer.style.display = null;
// 			}
// 		}
// 	});
// });

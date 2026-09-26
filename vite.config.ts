import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	base: "/template/",
	plugins: [tailwindcss()],
	build: {
		// Increases threshold slightly if 500kB is too strict for your project
		chunkSizeWarningLimit: 800,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						// Group all CodeMirror packages into a separate chunk
						if (
							id.includes("codemirror") ||
							id.includes("@codemirror") ||
							id.includes("thememirror")
						) {
							return "vendor-codemirror";
						}
						// Group jsPDF into its own export chunk
						if (id.includes("jspdf")) {
							return "vendor-jspdf";
						}
						// Group html-to-image
						if (id.includes("html-to-image")) {
							return "vendor-html-to-image";
						}
					}
				},
			},
		},
	},
});

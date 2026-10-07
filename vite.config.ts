import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import injectHTML from "vite-plugin-html-inject";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
	base: "/template/",
	plugins: [
		tailwindcss(),
		injectHTML(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: [
				"favicon/favicon.ico",
				"favicon/*.png",
				"apple-touch-icons/*.png",
			],
			manifest: {
				id: "1dfe0f7f-b2af-4609-ae29-c5eac91c648b",
				name: "template",
				short_name: "template",
				description:
					"Generate printable html template base on csv or json data",
				lang: "en",
				start_url: "./",
				scope: "./",
				display: "standalone",
				orientation: "portrait-primary",
				theme_color: "#171717",
				background_color: "#f5f5f5",
				icons: [
					{
						src: "/icons/icon-72x72.png",
						sizes: "72x72",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-96x96.png",
						sizes: "96x96",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-128x128.png",
						sizes: "128x128",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-144x144.png",
						sizes: "144x144",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-152x152.png",
						sizes: "152x152",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/maskable-icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/icons/icon-384x384.png",
						sizes: "384x384",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/maskable-icon-384x384.png",
						sizes: "384x384",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/icons/maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
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
	define: {
		"import.meta.env.PACKAGE_VERSION": JSON.stringify(pkg.version),
	},
});

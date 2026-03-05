import fs from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const fileStoragePlugin = (): Plugin => ({
	name: "file-storage",
	configureServer(server) {
		server.middlewares.use(async (req, res, next) => {
			if (!req.url?.startsWith("/api/")) return next();

			const dataDir = path.resolve(__dirname, "src/data");

			// Ensure dir exists
			try {
				await fs.mkdir(dataDir, { recursive: true });
			} catch {
				// directory already exists
			}

			res.setHeader("Content-Type", "application/json");

			try {
				if (req.method === "GET") {
					if (req.url === "/api/profile") {
						const file = path.join(dataDir, "family_profile.json");
						try {
							const data = await fs.readFile(file, "utf-8");
							res.end(data);
						} catch {
							res.statusCode = 404;
							res.end(JSON.stringify({ error: "Not found" }));
						}
					} else if (req.url.startsWith("/api/plan/")) {
						const week = req.url.split("/api/plan/")[1];
						const file = path.join(dataDir, `plan_week_${week}.json`);
						try {
							const data = await fs.readFile(file, "utf-8");
							res.end(data);
						} catch {
							res.statusCode = 404;
							res.end(JSON.stringify({ error: "Not found" }));
						}
					} else {
						res.statusCode = 404;
						res.end(JSON.stringify({ error: "Not found" }));
					}
				} else if (req.method === "POST") {
					let body = "";
					req.on("data", (chunk) => {
						body += chunk.toString();
					});
					req.on("end", async () => {
						const parsed = body ? JSON.parse(body) : {};

						if (req.url === "/api/profile") {
							const file = path.join(dataDir, "family_profile.json");
							await fs.writeFile(file, JSON.stringify(parsed, null, 2));
							res.end(JSON.stringify({ success: true }));
						} else if (req.url?.startsWith("/api/plan/")) {
							const week = req.url.split("/api/plan/")[1];
							const file = path.join(dataDir, `plan_week_${week}.json`);
							await fs.writeFile(file, JSON.stringify(parsed, null, 2));
							res.end(JSON.stringify({ success: true }));
						} else {
							res.statusCode = 404;
							res.end(JSON.stringify({ error: "Not found" }));
						}
					});
				}
			} catch (e) {
				const error = e as Error;
				res.statusCode = 500;
				res.end(JSON.stringify({ error: error.message }));
			}
		});
	},
});

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), fileStoragePlugin()],
});

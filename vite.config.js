import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

const root = import.meta.dirname;

function localTripsDevApiPlugin() {
  const localCacheFile = resolve(root, "src/data/trips/.local-dev-cache.json");

  const getLocalTrips = () => {
    let devCache = {};
    if (fs.existsSync(localCacheFile)) {
      try {
        devCache = JSON.parse(fs.readFileSync(localCacheFile, "utf8"));
      } catch (e) {}
    }

    const files = [
      { id: "hampi-2026", file: "hampi-2026.json" },
      { id: "vietnam-dec-2026", file: "vietnam.json" },
      { id: "chikmagalur-2026", file: "chikmagalur.json" },
    ];

    return files.map(({ id, file }) => {
      if (devCache[id]) {
        return devCache[id];
      }
      const raw = JSON.parse(
        fs.readFileSync(resolve(root, "src/data/trips", file), "utf8"),
      );
      return {
        id,
        data: raw,
        updated_at: new Date().toISOString(),
        source: "localhost_dev",
      };
    });
  };

  return {
    name: "local-trips-dev-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Enable CORS for local testing from WealthOS (localhost:5173)
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, apikey",
        );

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        if (url.pathname === "/api/trips" || url.pathname === "/api/trips/") {
          if (req.method === "GET") {
            const trips = getLocalTrips();
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(trips));
            return;
          }
        }

        if (url.pathname.startsWith("/api/trips/")) {
          const tripId = decodeURIComponent(
            url.pathname.replace(/^\/api\/trips\//, ""),
          );
          if (req.method === "GET") {
            const trips = getLocalTrips();
            const found = trips.find((t) => t.id === tripId);
            res.setHeader("Content-Type", "application/json");
            if (found) {
              res.statusCode = 200;
              res.end(JSON.stringify(found));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "Trip not found" }));
            }
            return;
          }

          if (
            req.method === "POST" ||
            req.method === "PATCH" ||
            req.method === "PUT"
          ) {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const parsed = JSON.parse(body);
                let devCache = {};
                if (fs.existsSync(localCacheFile)) {
                  try {
                    devCache = JSON.parse(
                      fs.readFileSync(localCacheFile, "utf8"),
                    );
                  } catch (e) {}
                }
                const updatedRow = {
                  id: tripId,
                  data: parsed.data || parsed,
                  updated_at: new Date().toISOString(),
                  source: "localhost_dev_saved",
                };
                devCache[tripId] = updatedRow;
                fs.writeFileSync(
                  localCacheFile,
                  JSON.stringify(devCache, null, 2),
                  "utf8",
                );
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, trip: updatedRow }));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localTripsDevApiPlugin()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        app: resolve(root, "react_app.html"),
        main: resolve(root, "index.html"),
        chikmagalur: resolve(root, "chikmagalur_trip_architect.html"),
        vietnam: resolve(root, "vietnam_trip_architect_5_0.html"),
        trip: resolve(root, "trip.html"),
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet")) return "vendor-leaflet";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("react") || id.includes("react-dom"))
              return "vendor-react";
            return "vendor-libs";
          }
        },
      },
    },
  },
});

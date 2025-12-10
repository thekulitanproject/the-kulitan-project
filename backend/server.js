// Import core libraries and your router
// - express: minimal web framework for Node.js to create HTTP servers and routes
// - path: Node.js helper for working with filesystem paths in a cross-platform way
// - fileURLToPath: converts import.meta.url to a file path (needed in ESM modules)
// - wordsRouter: your API route module that returns words data
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import wordsRouter from "./routes/words.js";

// Create the Express application instance
// This `app` object is the central piece where middleware and routes are registered.
const app = express();

// Resolve __filename and __dirname in ESM modules
// In CommonJS, __filename and __dirname are available automatically.
// In ESM (type: "module"), we derive them from import.meta.url.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// Middleware
// -----------------------------
// Middleware are functions that run for each request and can mutate req/res or stop the request.
// Here we register middleware that parses incoming JSON payloads into req.body.
// This is required if you expect to receive JSON from POST/PUT requests.
app.use(express.json());

// -----------------------------
// Static frontend hosting
// -----------------------------
// Serve all static files from the frontend directory. Requests for files like index.html,
// .css, .js, images, fonts, and any generated pages will be served automatically.
// path.join is used to build a safe cross-platform path relative to this file.
app.use(express.static(path.join(__dirname, "../frontend")));

// -----------------------------
// API routes
// -----------------------------
// Mount your router under /api/words. Any request to /api/words will be handled by wordsRouter.
// Example:
//  GET  /api/words        -> delegated to wordsRouter
//  GET  /api/words/:id    -> delegated to wordsRouter (if implemented)
// Keep API endpoints separate from the static site to avoid route conflicts.
app.use("/api/words", wordsRouter);

// -----------------------------
// Frontend client-side routing fallback
// -----------------------------
// Single page apps or static sites that use client-side routing still need index.html for unknown paths.
// If no other middleware matched, return index.html so the frontend can render the route on the client.
// Place this after static and API middleware to avoid capturing valid API or asset requests.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// -----------------------------
// Start server
// -----------------------------
// Bind the app to a TCP port and start accepting incoming connections.
// The callback runs once the server is listening and is a good place to log startup information.
// Port 5000 is used here to keep frontend and backend on separate ports during local development.
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

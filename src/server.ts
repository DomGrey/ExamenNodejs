// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { notFound } from "./controllers/notFoundController";
import snippetRoutes from "./routes/snippetRoutes";
import { getSnippetsForDashboard } from "./controllers/snippetController";
import mongoose from "mongoose";

// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "views");
// Serve static files like CSS and JS
app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/snippets", snippetRoutes);
app.get("/dashboard", getSnippetsForDashboard);
app.all("*", notFound);

// Database connection
try {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Database connection OK");
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}! 🚀`);
});

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // <-- yahi app use hoga
import fs from "fs";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://tumhara-frontend-url.onrender.com" // yahan apna actual frontend URL dalna
    ],
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  console.log("Checking for frontend dist folder at:", frontendDistPath);
  
  // Check if the frontend dist folder exists
  if (fs.existsSync(frontendDistPath)) {
    console.log("Frontend dist folder found, serving static files");
    app.use(express.static(frontendDistPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    });
  } else {
    console.log("Frontend dist folder not found, serving API only");
    app.get("*", (req, res) => {
      res.status(404).json({ message: "Frontend not built. API is running at /api" });
    });
  }
}

server.listen(PORT, () => { // <-- app.listen ki jagah server.listen
    console.log("Server is running on PORT", PORT);
    connectDB();
    console.log("NODE_ENV:", process.env.NODE_ENV);
});
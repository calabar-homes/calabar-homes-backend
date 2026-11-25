import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./auth/route.js";
import cookieParser from "cookie-parser";
import businessRouter from "./features/business/route.js";
import storageRouter from "./storage/route.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:5500",
    "https://calabar-admin.vercel.app"
];

// Security
app.use(helmet());

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Request parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
});

app.use((req, res, next) => {
    const start = Date.now();

    console.log("\n================================");
    console.log(`[${new Date().toLocaleTimeString()}] INCOMING REQUEST`);
    console.log(`${req.method} ${req.originalUrl}`);
    console.log("IP:", req.ip);

    res.on("finish", () => {
        console.log(
            `RESPONSE: ${res.statusCode} | ${Date.now() - start}ms`
        );
        console.log("================================\n");
    });

    next();
});
app.use("/api", limiter); 

app.use('/uploads', express.static('uploads'));

// app.post

// Routes
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API Sha de run"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/business", businessRouter);
app.use("/api/storage", storageRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.status ? err.message : "Internal server error"
    });
});


export default app;
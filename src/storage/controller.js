import db from "../db/schema.js";
import { mkdir, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


export const uploadController = (req, res, next) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
console.log("USER ID", req.user.id);

        db.prepare(`UPDATE users SET avatar_url = ? WHERE id = ?`)
            .run(
                path.resolve(__dirname, `../../data/storage/${req.file.filename}`),
                req.user.id
            );

        res.status(200).json({
            message: "Upload successful",
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                path: req.file.path
            }
        });

    } catch (err) {
        next(err);
    }
};
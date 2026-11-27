import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadDir = path.resolve(__dirname, "../../data/storage");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destination;

        // User avatar
        if (file.fieldname === "avatar") {
            destination = path.join(uploadDir, "avatars/");
        }

        // General user files
        else if (file.fieldname === "file") {
            if (!req.user?.id) {
                return cb(new Error("Authenticated user ID missing"));
            }

            destination = path.join(
                uploadDir,
                "obj",
                `box-${req.user.id}`
            );
        }

        else {
            return cb(new Error("Invalid upload field"));
        }

        fs.mkdir(destination, { recursive: true }, (err) => {
            if (err) return cb(err);
            cb(null, destination);
        });
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName = `${randomUUID()}${extension}`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error("Unsupported file type"));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;

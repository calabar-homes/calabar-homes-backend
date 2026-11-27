import { Router } from "express";
import { authenticate } from "../auth/middleware.js";
import upload from "./upload.js";
import { uploadController } from "./controller.js";

const storageRouter = Router();
storageRouter.post(
    "/avatar",
    authenticate,
    upload.single("avatar"),
    uploadController
);

storageRouter.post(
    "/box",
    authenticate,
    upload.single("file"),
    uploadController
);

export default storageRouter;
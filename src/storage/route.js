import { Router } from "express";
import { authenticate } from "../auth/middleware.js";
import upload from "./upload.js";
import { uploadController } from "./controller.js";

const storageRouter = Router();
storageRouter.post(
    "/upload",
    authenticate,
    upload.single("avatar"),
    uploadController
);

export default storageRouter;
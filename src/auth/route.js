import express from "express";
import { login, register } from "./controller.js";
import { authenticate } from "./middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});
export default authRouter;
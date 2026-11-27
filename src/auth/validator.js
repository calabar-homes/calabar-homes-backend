
import { findUserByEmail } from "./utils/index.js";
import { compare } from "bcrypt";

export const validateLogin = async ({ email, password }) => {
    const errors = [];

    if (!email || typeof email !== "string" || !email.includes("@")) {
        errors.push("Invalid Email");
        return { errors, user: null };
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required");
        return { errors, user: null };
    }

    const user = findUserByEmail(email);

    if (!user) {
        errors.push("Invalid email or password");
        return { errors, user: null };
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
        errors.push("Invalid email or password");
    }

    return { errors, user };
};
        
import db from "../db/schema.js";
import crypto from "node:crypto";

export const authenticate = (req, res, next) => {
try {
        // 1. Get raw token from cookie
        const token = req.cookies.session;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // 2. Hash the raw token
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 3. Find valid session and its user
        const session = db.prepare(`
            SELECT 
                sessions.id AS session_id,
                sessions.expires_at,
                users.id AS user_id,
                users.fullname,
                users.email,
                users.role
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token = ?
              AND sessions.expires_at > ?
        `).get(tokenHash, new Date().toISOString());

        // 4. Reject if session doesn't exist or has expired
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired session"
            });
        }

        // 5. Attach authenticated user to request
        req.user = {
            id: session.user_id,
            fullname: session.fullname,
            email: session.email,
            role: session.role
        };

        req.session = {
            id: session.session_id,
            expiresAt: session.expires_at
        };

        // 6. Continue
        next();

    } catch (error) {
        next(error);
    }
};
import db from "../../db/schema.js"
export const findUserByEmail = (email) => {
    const user = db.prepare(`SELECT * from users WHERE email = ?`).get(email);
    if(!user){
        return null;
    }
    return user;
}
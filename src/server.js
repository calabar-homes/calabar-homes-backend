import dotenv from "dotenv";
dotenv.config();
import db from "./db/schema.js";
import "./storage/schema.js"

import app from "./app.js";

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
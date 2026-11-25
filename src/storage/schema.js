import { mkdir, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("URL: ", import.meta.url);
// Database location
export const objPath = path.resolve(__dirname, "../../data/storage/s");
const avatarsPath = path.resolve(__dirname, "../../data/storage/avatars/s");
const obj = path.resolve(__dirname, "../../data/storage/avatars/s");

// Ensure the data directory exists
// store avatars
    mkdir(path.dirname(path.resolve(__dirname, "../../data/storage/avatars/s")), { recursive: true}, (err) => {
  if (err) throw err;
});
    

export const hasUserBucket = (userId) => {
    if(existsSync(path.resolve(__dirname, `../../data/storage/obj/box-${userId}`))){
        console.log("bucket exists");
        return true;
    }
    return false;
}
export const addUserBucket = (userId) => {
    mkdir(path.dirname(path.resolve(__dirname, `../../data/storage/obj/box-${userId}/s`)), { recursive: true }, (err) => {
  if (err) throw err;
});
}

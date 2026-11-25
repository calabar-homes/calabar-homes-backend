import express from "express"
import fs from "node:fs";
import { Buffer } from 'node:buffer';

    
const businessRouter = express.Router();
businessRouter.post("/add-avatar", (req, res) => {
    const {image} = req.body;
    try {
        // try to read the image downloaded first
        
        // try to store the image in the box
        const data = new Uint8Array(Buffer.from(image));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});

res.status(200).json({success: true, message: "saved avatar"})


    } catch (error) {
        res.status(500).json({success: false, message: "Server error"})
    }

});

export default businessRouter;
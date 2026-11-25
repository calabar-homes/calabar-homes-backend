export const uploadController = (req, res) => {
    try{

        console.log(req.file);
        console.log(req.body);
        
        res.status(200).json({
            message: "Upload successful",
            file: req.file
        });
    }catch(err){
        console.error("STORAGE ERROR: ", error);
        
    }
};
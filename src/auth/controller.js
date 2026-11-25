import { loginUser, registerUser } from "./service.js";
import { findUserByEmail } from "./utils/index.js";

export const register = async (req, res) => {
    try{
        const { fullname, email, password } = req.body;
        // check if user already exists
        const savedUser = findUserByEmail(email);
        console.log("Existed USER: ", savedUser);
        if(savedUser != null){
            res.status(400).json({success: false, message: "User Already Exists"});
            return;
        }

            // register new user
        await registerUser({ fullname: fullname, email: email, password: password });
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser({email: email, password: password});

        res.status(200).cookie("session", result.token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,
                sameSite: "none",
                maxAge: 3 * 24 * 60 * 60 * 1000,
                path: "/"
            }
        ).json({status: "success", message: "User Logged in successfully", user: result.user})
    } catch (error) {
        console.log("Error: ", error);
    
    }
}


export const changeRole = async(req, res) => {

}
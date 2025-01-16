import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

//for checking that users have authorize to update datas
export const protectRoute = async (req, res, next) => {
    try {
        //check if users have token or not
        const token = req.cookies.jwt; //from generateToken
        if(!token) {
            return res.status(401).json({message: "Unauthorize - No token provided"})
        };

        //if users have token
        // 1.decoded cookie value with our secret code
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 2. if decoded failed
        if(!decoded) {
            return res.status(401).json({message: "Unauthorized - Invalid Token"})
        }

        //if docoded success, pass all datas except the password
        const user = await User.findById(decoded.userId).select('-password');

        //In case when cannot find user (optional/sometimes use)
        if(!user) {
            return res.status(404).json({message: "User not found"})
        };

        
        req.user = user
        next();


    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({message: "internal server error"});
    }
}
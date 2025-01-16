import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';


// 1. signup, login, logout part
export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        //check if user input fullName, email, password
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        //check if the password more than 6 characters
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        //check if email already exists
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: 'Email already exists'});

        //Generate a salt with 10 rounds synchronously
        const salt = await bcrypt.genSalt(10);
        //then hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        //then check data for newUser
        if(newUser) {
            //generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
            })

        }else {
            res.status(400).json({message: 'Invalid user data'});
        }

    }catch (error) {
        console.log('Error in signup controller', error.message);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    console.log('Request body', req.body);
    
    try {
        //check if user input email and password
        const user = await User.findOne({email})
        console.log('User found', user);
        
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        //check input password compared with bcrypt password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Pasword match:', isPasswordCorrect);
        
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }

        //if password correct
        generateToken(user._id, res);
        console.log('Token generated');
        

        //return user datas
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

        
    } catch (error) {
        console.log("Error in login controller", error.message);
        
    }
};

export const logout = (req, res) => {
   try {
    res.cookie()
        res.cookie('jwt', '', {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"})

   } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({message: "internal Server Error"})
   }
};


//2. update data part (can change only profile image)
// use with cloudinary
export const updateProfile = async (req, res) => {
     
     try {
        //access to profilePic and userid(come from protectRoute)
        const {profilePic} = req.body;
        const userId = req.user._id;

        //check if there is no profilePic insert
        if (!profilePic) {
            return res.status(400).json({message: 'Profile pic is required'})
        };
       
        // if profilePic has inserted, then upload to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        
        // then update profilePic in MongoDB database
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log('error in update profile: ',error);
        res.status(500).json({message: 'Internal server error'});
    }
};


//3.check if users have authentication (use when refresh the page)
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: 'Internal Server Error'})
    }
}
import User from '../models/user.model.js';
import bcrypt, { truncates } from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" })}
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
        });
        await newUser.save();
        generateToken(newUser._id, res);
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic
            }
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async(req, res)=>{
const { email, password } = req.body;
 try {
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email})

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        }
    });
    
 } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
    
 }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        
        let imageUrl = profilePic;
        
        // Only use Cloudinary if environment variables are set
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(profilePic);
                imageUrl = uploadResponse.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                // Fall back to using the original image URL
                imageUrl = profilePic;
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: imageUrl}, 
            { new: true }
        ).select("-password");
        
        res.status(200).json(updatedUser);
           

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        console.log("getUsersForSidebar called");
        const loggedInUserId = req.user._id;
        console.log("Logged in user ID:", loggedInUserId);
        
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        console.log("Found users:", filteredUsers.length);
        console.log("Users:", filteredUsers);
        
        res.status(200).json(filteredUsers);
        
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const getMessage = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId:myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        

res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

// send message

export const sendMessage = async (req, res) => {
    try {
        const { text, image, audio } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;
        if(image){
            // Only use Cloudinary if environment variables are set
            if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    imageUrl = uploadResponse.secure_url;
                } catch (cloudinaryError) {
                    console.error("Cloudinary upload error:", cloudinaryError);
                    // Fall back to using the original image data
                    imageUrl = image;
                }
            } else {
                // If Cloudinary is not configured, use the image data directly
                imageUrl = image;
            }
        }

        let audioUrl = null;
        if(audio){
            // For now, just store base64 or URL directly
            audioUrl = audio;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            audio: audioUrl
        });
        
        await newMessage.save();
        res.status(200).json(newMessage);

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (String(message.senderId) !== String(userId)) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }
        await message.deleteOne();
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
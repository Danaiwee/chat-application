import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from "../lib/socket.js";


//1.get all user datas except our data to show on the sidebar.
export const getUserForSidebar = async (req, res) => {
    try {
        //get user id (my id)
        const loggedInUserId = req.user._id;
        //fetch all other user datas (except my id) and do not fetch password
        const filteredUser = await User.find({_id: {$ne:loggedInUserId}}).select("-password")

        res.status(200).json(filteredUser);
    } catch (error) {
        console.error('Error in getUserForSidebar: ', error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

//2.get message data to show on the screen
export const getMessages = async (req, res) => {
    try {
        // Id ofuser that we need to chat to
        const {id: userToChatId} = req.params;
        // my id
        const myId = req.user._id;
        // find all the messages
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });

        //then return all messages
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

//3. for sending messages
export const sendMessage = async (req, res) => {
    try {
        
        //(part 1)
        //access to text and image
        const {text, image} = req.body;
        //access to receive id
        const {id: receiverId} = req.params;
        //access to my id
        const senderId = req.user._id;

        //check if user send image or not
        let imageUrl;
        // then upload image to cloudary
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        //create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        
        //(part2: real time functionality) => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" }); 
    }
}
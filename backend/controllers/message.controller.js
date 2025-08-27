import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getSocketId, io } from "../server.js";

async function sendMessage(req, res) {
    try {
        const sender = req.user.userId;
        const receiver = req.params.receiverId;
        const message = req.body.message;
        console.log(sender, receiver, message);
        if (!sender || !receiver || !message) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters"
            });
        }
        const newMessage = await Message.create({
            senderId: sender,
            receiverId: receiver,
            message: message
        });
        if (newMessage) {
            let conversation = await Conversation.findOne({
                participants: { $all: [sender, receiver] },
            })
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [sender, receiver],
                    messages: [newMessage._id]
                });

            }
            else {
                let conversation = await Conversation.findOneAndUpdate(
                    { participants: { $all: [sender, receiver] } },
                    { $push: { messages: newMessage._id } },
                    { new: true }
                );
            }
            const receiversocketId = getSocketId(receiver);
            if (receiversocketId) {
                io.to(receiversocketId).emit("newMessage", newMessage);
            }
            res.status(201).json({
                success: true,
                message: newMessage,
            });
        }
        else {
            return res.status(500).json({
                success: false,
                message: "Failed to send message"
            });
        }
    }
    catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
}

async function getMessages(req, res) {
    try {
        const myId = req.user.userId;
        const otherParticipantId = req.params.participantId;
        if (!myId || !otherParticipantId) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters"
            });
        }
        const conversation = await Conversation.findOne({
            participants: { $all: [myId, otherParticipantId] }
        }).populate({
            path: "messages",
            populate: {
                path: "senderId",
                select: "fullName username avatar isVerified"
            },
            populate: {
                path: "receiverId",
                select: "fullName username avatar isVerified"
            }
        })
        return res.status(200).json({
            success: true,
            messages: conversation?.messages || [],
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message
        });
    }
}

export { sendMessage, getMessages };
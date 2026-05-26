import Notification from "../Models/notificationModel.js";
import Message from "../Models/messageModel.js";
import Post from "../Models/postModel.js";
import User from "../Models/userModel.js";
import { sendNotification } from "../Services/socketService.js";

// Get all conversations for the logged in user
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all messages involving the user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
      .populate({
        path: 'postId',
        select: 'content image author',
        populate: { path: 'author', select: 'username name profileImage verified' }
      })
      .populate({
        path: 'profileId',
        select: 'username name profileImage bio verified followers following'
      })
      .sort({ createdAt: 1 }); // oldest to newest

    const convosMap = new Map();

    messages.forEach(m => {
      const otherUserId = m.senderId.toString() === userId ? m.receiverId.toString() : m.senderId.toString();
      
      if (!convosMap.has(otherUserId)) {
        convosMap.set(otherUserId, { id: otherUserId, with: otherUserId, messages: [] });
      }
      
      const msg = {
        id: m._id.toString(),
        senderId: m.senderId.toString(),
        text: m.text,
        ts: m.createdAt,
        read: m.read
      };
      if (m.postId) {
        msg.sharedPost = {
          _id: m.postId._id,
          content: m.postId.content,
          image: m.postId.image,
          author: m.postId.author
        };
      }
      if (m.profileId) {
        msg.sharedProfile = {
          _id: m.profileId._id,
          username: m.profileId.username,
          name: m.profileId.name,
          profileImage: m.profileId.profileImage,
          bio: m.profileId.bio,
          verified: m.profileId.verified,
          followersCount: m.profileId.followers ? m.profileId.followers.length : 0,
          followingCount: m.profileId.following ? m.profileId.following.length : 0
        };
      }
      convosMap.get(otherUserId).messages.push(msg);
    });

    res.status(200).json(Array.from(convosMap.values()));
  } catch (error) {
    console.error("Error in getConversations:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, postId, profileId } = req.body;
    const senderId = req.userId;

    if (!receiverId || (!text && !postId && !profileId)) {
      return res.status(400).json({ error: "Receiver ID and text, postId or profileId are required" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || '',
      postId: postId || null,
      profileId: profileId || null,
      read: false
    });

    await newMessage.save();

    // If it's a shared post, populate the post data
    let sharedPost = null;
    if (postId) {
      const post = await Post.findById(postId)
        .select('content image author')
        .populate('author', 'username name profileImage verified');
      if (post) {
        sharedPost = {
          _id: post._id,
          content: post.content,
          image: post.image,
          author: post.author
        };
      }
    }

    let sharedProfile = null;
    if (profileId) {
      const profileUser = await User.findById(profileId)
        .select('username name profileImage bio verified followers following');
      if (profileUser) {
        sharedProfile = {
          _id: profileUser._id,
          username: profileUser.username,
          name: profileUser.name,
          profileImage: profileUser.profileImage,
          bio: profileUser.bio,
          verified: profileUser.verified,
          followersCount: profileUser.followers ? profileUser.followers.length : 0,
          followingCount: profileUser.following ? profileUser.following.length : 0
        };
      }
    }

    // Create notification
    const notification = await Notification.create({
      receiverId,
      senderId,
      type: 'message',
      text: postId ? 'Shared a post' : profileId ? 'Shared a profile' : (text || '').substring(0, 50)
    });

    try {
      const populatedNotification = await Notification.findById(notification._id)
        .populate("senderId", "username name profileImage verified")
        .populate("postId", "content");
      sendNotification(receiverId, populatedNotification);
    } catch (err) {
      console.error("Failed to emit real-time message notification:", err);
    }

    const response = {
      id: newMessage._id.toString(),
      senderId: newMessage.senderId.toString(),
      text: newMessage.text,
      ts: newMessage.createdAt,
      read: newMessage.read,
      with: receiverId
    };
    if (sharedPost) response.sharedPost = sharedPost;
    if (sharedProfile) response.sharedProfile = sharedProfile;

    res.status(201).json(response);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark a conversation's messages as read
export const markRead = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.userId;

    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error in markRead:", error);
    res.status(500).json({ error: "Server error" });
  }
};

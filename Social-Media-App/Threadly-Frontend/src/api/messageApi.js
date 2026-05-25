// messageApi.js - Contains functions for making API calls related to messaging,
// such as fetching conversations, sending messages, and marking messages as read.
import axiosInstance from './axiosInstance'

export const messageApi = {
  getConversations: () => axiosInstance.get('/messages/conversations'),
  sendMessage: (receiverId, text) => axiosInstance.post('/messages', { receiverId, text }),
  markRead: (otherUserId) => axiosInstance.put(`/messages/${otherUserId}/read`),
}

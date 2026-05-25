// notificationApi.js - Contains functions for making API calls related to notifications,
// such as fetching notifications and marking them as read.
import axiosInstance from './axiosInstance'

export const notificationApi = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markReadAll: () => axiosInstance.put('/notifications/read'),
}

// feedApi.js - Contains functions for making API calls related to fetching the 
// user's feed, explore feed, and bookmarks feed.
import axiosInstance from './axiosInstance'
export const feedApi = {
  getFeed:         (page=1) => axiosInstance.get(`/feed?page=${page}`),
  getExploreFeed:  (page=1) => axiosInstance.get(`/feed/explore?page=${page}`),
  getBookmarksFeed: ()      => axiosInstance.get('/feed/bookmarks'),
}

import axiosInstance from './axiosInstance'

export const postApi = {

  // CREATE POST
  createPost: (content, imageFile) => {

    const formData = new FormData()

    formData.append('content', content)

    if (imageFile instanceof File) {
      formData.append('images', imageFile)
    }

    return axiosInstance.post(
      '/posts',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },

  // GET ALL POSTS
  getAllPosts: () =>
    axiosInstance.get('/posts/all'),

  // GET USER POSTS
  getUserPosts: (userId) =>
    axiosInstance.get(`/posts/user/${userId}`),

  // GET FEED
  getFeed: () =>
    axiosInstance.get('/posts/feed'),

  // GET SINGLE POST
  getPostById: (id) =>
    axiosInstance.get(`/posts/${id}`),

  // UPDATE POST  ← THIS WAS MISSING
  updatePost: (postId, content) =>
    axiosInstance.put(
      `/posts/${postId}`,
      { content }
    ),

  // DELETE POST
  deletePost: (id) =>
    axiosInstance.delete(`/posts/${id}`),

  // LIKE POST
  likePost: (id) =>
    axiosInstance.post(`/posts/${id}/like`),

  // COMMENT
  addComment: (postId, content) =>
    axiosInstance.post(
      `/posts/${postId}/comment`,
      { content }
    ),

  // REPLY
  addReply: (
    postId,
    commentId,
    content
  ) =>
    axiosInstance.post(
      `/posts/${postId}/comment/${commentId}/reply`,
      { content }
    ),

  // BOOKMARK
  bookmarkPost: (id) =>
    axiosInstance.post(`/posts/${id}/bookmark`),

  // SHARE
  sharePost: (id) =>
    axiosInstance.post(`/posts/${id}/share`)
}
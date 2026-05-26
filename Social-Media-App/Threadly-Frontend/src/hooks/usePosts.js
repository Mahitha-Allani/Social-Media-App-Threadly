// usePosts.js - Custom hook for managing posts in the application, including fetching posts, creating new posts,
// liking, bookmarking, sharing, commenting, and replying to posts. This hook abstracts away the logic for interacting
// with the post API and managing local state for posts, providing a clean interface for components to use.

import { useState, useEffect, useCallback } from 'react'
import { postApi } from '../api/postApi'

export function usePosts() {

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // FETCH POSTS
  useEffect(() => {

    const fetchPosts = async () => {

      try {

        setLoading(true)

        const response =
          await postApi.getAllPosts()

        const formattedPosts =
          (response.data || []).map(p => ({

            _id: p._id,

            userId: {
              _id:
                p.author?._id || p.author,

              name:
                p.author?.displayName ||
                p.author?.name ||
                p.author?.username ||
                'Unknown',

              username:
                p.author?.username,

              verified:
                p.author?.verified || false,

              profileImage:
                p.author?.profileImage ||
                p.author?.profilePicture,

              profilePicture:
                p.author?.profileImage ||
                p.author?.profilePicture
            },

            content: p.content,

            image:
              p.image || null,

            likes:
              p.likes || [],

            comments:
              p.comments || [],

            bookmarks:
              p.bookmarks || [],

            shares:
              p.shares || [],

            createdAt:
              p.createdAt ||
              new Date().toISOString()

          }))

        setPosts(formattedPosts)

      } catch (error) {

        console.log(
          'Error fetching posts:',
          error
        )

      } finally {

        setLoading(false)
      }
    }

    fetchPosts()

  }, [])

  // CREATE POST
  const createPost = useCallback(
    async (
      content,
      image,
      currentUser
    ) => {

      if (
        !content.trim() ||
        !currentUser
      ) return null

      try {

        const response =
          await postApi.createPost(
            content,
            image instanceof File
              ? image
              : null
          )

        const newPost =
          response.data

        const transformedPost = {

          _id: newPost._id,

          userId: {
            _id:
              typeof newPost.author === 'object'
                ? newPost.author._id
                : newPost.author,

            name:
              typeof newPost.author === 'object'
                ? (
                    newPost.author.displayName ||
                    newPost.author.name ||
                    'Unknown'
                  )
                : currentUser.name,

            username:
              typeof newPost.author === 'object'
                ? newPost.author.username
                : currentUser.username,

            verified:
              typeof newPost.author === 'object'
                ? (
                    newPost.author.verified ||
                    false
                  )
                : (
                    currentUser.verified ||
                    false
                  ),

            profileImage:
              typeof newPost.author === 'object'
                ? (
                    newPost.author.profileImage ||
                    newPost.author.profilePicture
                  )
                : (
                    currentUser.profileImage ||
                    currentUser.profilePicture
                  ),

            profilePicture:
              typeof newPost.author === 'object'
                ? (
                    newPost.author.profileImage ||
                    newPost.author.profilePicture
                  )
                : (
                    currentUser.profileImage ||
                    currentUser.profilePicture
                  )
          },

          content:
            newPost.content,

          image:
            newPost.image || null,

          likes:
            newPost.likes || [],

          comments:
            newPost.comments || [],

          bookmarks:
            newPost.bookmarks || [],

          shares:
            newPost.shares || [],

          createdAt:
            newPost.createdAt ||
            new Date().toISOString()
        }

        setPosts(prev => [
          transformedPost,
          ...prev
        ])

        return transformedPost

      } catch (error) {

        console.log(
          'Error creating post:',
          error
        )
      }

    },
    []
  )

  // UPDATE POST
  const updatePost = useCallback(
    async (
      postId,
      content
    ) => {

      try {

        const response =
          await postApi.updatePost(
            postId,
            content
          )

        const updatedPost =
          response.data

        setPosts(prev =>
          prev.map(p =>

            p._id === postId

              ? {
                  ...p,
                  content:
                    updatedPost.content
                }

              : p
          )
        )

        return updatedPost

      } catch (error) {

        console.log(
          'Error updating post:',
          error
        )
      }

    },
    []
  )

  // DELETE POST
  const deletePost = useCallback(
    async (postId) => {

      setPosts(prev =>
        prev.filter(
          p => p._id !== postId
        )
      )

      try {

        await postApi.deletePost(
          postId
        )

      } catch (error) {

        console.log(
          'Error deleting post:',
          error
        )
      }

    },
    []
  )

  // LIKE
  const toggleLike = useCallback(
    async (
      postId,
      userId
    ) => {

      setPosts(prev =>
        prev.map(p =>

          p._id !== postId

            ? p

            : {
                ...p,

                likes:
                  p.likes.includes(userId)

                    ? p.likes.filter(
                        id => id !== userId
                      )

                    : [
                        ...p.likes,
                        userId
                      ]
              }
        )
      )

      try {

        await postApi.likePost(
          postId
        )

      } catch (error) {

        console.log(error)
      }

    },
    []
  )

  // BOOKMARK
  const toggleBookmark = useCallback(
    async (
      postId,
      userId
    ) => {

      setPosts(prev =>
        prev.map(p =>

          p._id !== postId

            ? p

            : {
                ...p,

                bookmarks:
                  p.bookmarks?.includes(userId)

                    ? p.bookmarks.filter(
                        id => id !== userId
                      )

                    : [
                        ...(p.bookmarks || []),
                        userId
                      ]
              }
        )
      )

      try {

        await postApi.bookmarkPost(
          postId
        )

      } catch (error) {

        console.log(error)
      }

    },
    []
  )

  // SHARE
  const sharePost = useCallback(
    async (
      postId,
      userId
    ) => {

      setPosts(prev =>
        prev.map(p =>

          p._id !== postId

            ? p

            : {
                ...p,

                shares:
                  p.shares?.includes(userId)

                    ? p.shares.filter(
                        id => id !== userId
                      )

                    : [
                        ...(p.shares || []),
                        userId
                      ]
              }
        )
      )

      try {

        await postApi.sharePost(
          postId
        )

      } catch (error) {

        console.log(error)
      }

    },
    []
  )

  // COMMENT
  const addComment = useCallback(
    async (
      postId,
      comment,
      currentUser
    ) => {

      const newComment = {

        _id:
          Date.now().toString(),

        userId: {

          _id:
            currentUser?._id,

          name:
            currentUser?.name ||
            'User',

          username:
            currentUser?.username,

          verified:
            currentUser?.verified ||
            false,

          profileImage:
            currentUser?.profileImage ||
            currentUser?.profilePicture
        },

        content: comment,

        createdAt:
          new Date().toISOString(),

        replies: []
      }

      setPosts(prev =>
        prev.map(p =>

          p._id === postId

            ? {
                ...p,
                comments: [
                  ...p.comments,
                  newComment
                ]
              }

            : p
        )
      )

      try {

        await postApi.addComment(
          postId,
          comment
        )

      } catch (error) {

        console.log(error)
      }

    },
    []
  )

  // REPLY
  const addReply = useCallback(
    async (
      postId,
      commentId,
      content,
      currentUser
    ) => {

      const newReply = {

        _id:
          'r' + Date.now(),

        userId: {

          _id:
            currentUser?._id,

          name:
            currentUser?.name,

          username:
            currentUser?.username,

          verified:
            currentUser?.verified ||
            false
        },

        content,

        createdAt:
          new Date().toISOString()
      }

      setPosts(prev =>
        prev.map(p => {

          if (
            p._id === postId
          ) {

            return {

              ...p,

              comments:
                p.comments.map(c =>

                  c._id === commentId

                    ? {
                        ...c,
                        replies: [
                          ...(c.replies || []),
                          newReply
                        ]
                      }

                    : c
                )
            }
          }

          return p
        })
      )

      try {

        await postApi.addReply(
          postId,
          commentId,
          content
        )

      } catch (error) {

        console.log(error)
      }

    },
    []
  )

  return {

    posts,

    loading,

    createPost,

    updatePost,

    deletePost,

    toggleLike,

    toggleBookmark,

    sharePost,

    addComment,

    addReply
  }
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    photo?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: string[];
  dislikes: string[];
  replies: Comment[];
  parentComment?: string;
}

interface CommentsState {
  commentsByProject: {
    [projectId: string]: Comment[];
  };
}

const initialState: CommentsState = {
  commentsByProject: {},
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // Set all comments for a project
    setComments: (
      state,
      action: PayloadAction<{ projectId: string; comments: Comment[] }>
    ) => {
      const { projectId, comments } = action.payload;
      state.commentsByProject[projectId] = comments;
    },

    // Add a new comment
    addComment: (
      state,
      action: PayloadAction<{ projectId: string; comment: Comment }>
    ) => {
      const { projectId, comment } = action.payload;
      if (!state.commentsByProject[projectId]) {
        state.commentsByProject[projectId] = [];
      }
      state.commentsByProject[projectId].unshift(comment);
    },

    // Add a reply to a comment
    addReply: (
      state,
      action: PayloadAction<{
        projectId: string;
        parentId: string;
        reply: Comment;
      }>
    ) => {
      const { projectId, parentId, reply } = action.payload;
      const comments = state.commentsByProject[projectId];

      if (!comments) return;

      // Find parent comment and add reply
      const findAndAddReply = (commentsList: Comment[]): boolean => {
        for (let i = 0; i < commentsList.length; i++) {
          if (commentsList[i]._id === parentId) {
            if (!commentsList[i].replies) {
              commentsList[i].replies = [];
            }
            commentsList[i].replies.push(reply);
            return true;
          }

          // Check in replies recursively
          if (commentsList[i].replies && commentsList[i].replies.length > 0) {
            const found = findAndAddReply(commentsList[i].replies);
            if (found) return true;
          }
        }
        return false;
      };

      findAndAddReply(comments);
    },

    // Like/unlike a comment
    toggleLike: (
      state,
      action: PayloadAction<{
        projectId: string;
        commentId: string;
        userId: string;
      }>
    ) => {
      const { projectId, commentId, userId } = action.payload;
      const comments = state.commentsByProject[projectId];

      if (!comments) return;

      const updateLikes = (commentsList: Comment[]): boolean => {
        for (let i = 0; i < commentsList.length; i++) {
          if (commentsList[i]._id === commentId) {
            const comment = commentsList[i];
            const likedIndex = comment.likes.indexOf(userId);

            if (likedIndex >= 0) {
              // Unlike
              comment.likes.splice(likedIndex, 1);
            } else {
              // Like and remove from dislikes if present
              comment.likes.push(userId);
              const dislikedIndex = comment.dislikes.indexOf(userId);
              if (dislikedIndex >= 0) {
                comment.dislikes.splice(dislikedIndex, 1);
              }
            }
            return true;
          }

          // Check in replies
          if (commentsList[i].replies && commentsList[i].replies.length > 0) {
            const found = updateLikes(commentsList[i].replies);
            if (found) return true;
          }
        }
        return false;
      };

      updateLikes(comments);
    },

    // Dislike/undislike a comment
    toggleDislike: (
      state,
      action: PayloadAction<{
        projectId: string;
        commentId: string;
        userId: string;
      }>
    ) => {
      const { projectId, commentId, userId } = action.payload;
      const comments = state.commentsByProject[projectId];

      if (!comments) return;

      const updateDislikes = (commentsList: Comment[]): boolean => {
        for (let i = 0; i < commentsList.length; i++) {
          if (commentsList[i]._id === commentId) {
            const comment = commentsList[i];
            const dislikedIndex = comment.dislikes.indexOf(userId);

            if (dislikedIndex >= 0) {
              // Remove dislike
              comment.dislikes.splice(dislikedIndex, 1);
            } else {
              // Dislike and remove from likes if present
              comment.dislikes.push(userId);
              const likedIndex = comment.likes.indexOf(userId);
              if (likedIndex >= 0) {
                comment.likes.splice(likedIndex, 1);
              }
            }
            return true;
          }

          // Check in replies
          if (commentsList[i].replies && commentsList[i].replies.length > 0) {
            const found = updateDislikes(commentsList[i].replies);
            if (found) return true;
          }
        }
        return false;
      };

      updateDislikes(comments);
    },

    // Delete a comment
    deleteComment: (
      state,
      action: PayloadAction<{ projectId: string; commentId: string }>
    ) => {
      const { projectId, commentId } = action.payload;
      const comments = state.commentsByProject[projectId];

      if (!comments) return;

      // First try to delete from top level
      state.commentsByProject[projectId] = comments.filter(
        (c) => c._id !== commentId
      );

      // If not found at top level, search in replies
      if (state.commentsByProject[projectId].length === comments.length) {
        const removeFromReplies = (commentsList: Comment[]): boolean => {
          for (let i = 0; i < commentsList.length; i++) {
            if (commentsList[i].replies && commentsList[i].replies.length > 0) {
              const originalLength = commentsList[i].replies.length;
              commentsList[i].replies = commentsList[i].replies.filter(
                (r) => r._id !== commentId
              );

              if (commentsList[i].replies.length < originalLength) {
                return true;
              }

              // Search deeper
              const found = removeFromReplies(commentsList[i].replies);
              if (found) return true;
            }
          }
          return false;
        };

        removeFromReplies(state.commentsByProject[projectId]);
      }
    },
  },
});

export const {
  setComments,
  addComment,
  addReply,
  toggleLike,
  toggleDislike,
  deleteComment,
} = commentsSlice.actions;

export default commentsSlice.reducer;

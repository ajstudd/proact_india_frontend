import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setComments,
  addComment,
  addReply,
  toggleLike,
  toggleDislike,
  deleteComment,
} from "../store/commentsSlice";

export interface Comment {
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

export const useCommentsState = (projectId: string) => {
  const dispatch = useDispatch();
  const allComments = useSelector(
    (state: RootState) => state.commentsSlice.commentsByProject[projectId] || []
  );

  // Get root comments (those without a parent comment)
  const rootComments = allComments.filter((comment) => !comment.parentComment);

  // Sort comments by creation date (newest first)
  const sortedComments = [...rootComments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const initializeComments = (comments: Comment[]) => {
    dispatch(setComments({ projectId, comments }));
  };

  const handleAddComment = (comment: Comment) => {
    dispatch(addComment({ projectId, comment }));
  };

  const handleAddReply = (parentId: string, reply: Comment) => {
    dispatch(addReply({ projectId, parentId, reply }));
  };

  const handleLikeComment = (commentId: string, userId: string) => {
    dispatch(toggleLike({ projectId, commentId, userId }));
  };

  const handleDislikeComment = (commentId: string, userId: string) => {
    dispatch(toggleDislike({ projectId, commentId, userId }));
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteComment({ projectId, commentId }));
  };

  return {
    comments: sortedComments,
    initializeComments,
    addComment: handleAddComment,
    addReply: handleAddReply,
    likeComment: handleLikeComment,
    dislikeComment: handleDislikeComment,
    deleteComment: handleDeleteComment,
  };
};

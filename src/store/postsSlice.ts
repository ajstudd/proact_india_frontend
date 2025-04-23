import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreatePostData, IPost } from 'types/posts';
import { postApi } from 'services';

export interface PostState {
  posts: IPost[];
  createPostData: ICreatePostData;
  singlePost: IPost | null;
}

const initialState: PostState = {
  posts: [],
  createPostData: {
    title: '',
    content: '',
    password: '',
    isLocked: false,
    visibleTo: [],
    images: [],
  },
  singlePost: null,
};

const postSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    addPost : (state, action: PayloadAction<IPost>) => {
      state.posts.push(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
    },
    setCreatePostData: (state, action: PayloadAction<Partial<ICreatePostData>>) => {
      state.createPostData = {
        ...state.createPostData,
        ...action.payload,
      }
    },
    setSinglePost: (state, action: PayloadAction<IPost>) => {
      state.singlePost = action.payload;
    },
    updatePostInList: (state, action: PayloadAction<IPost>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      state.posts[index] = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addMatcher(
      postApi.endpoints.getAllPosts.matchFulfilled,
      (state, action) => {
        state.posts = action.payload.posts;
      },
    );
  },
});

export const { addPost,deletePost,setCreatePostData,setPosts,setSinglePost,updatePostInList } = postSlice.actions;

export default postSlice.reducer;

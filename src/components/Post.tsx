import React, { useState, useEffect, useRef } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { FiImage, FiLock } from "react-icons/fi";
import { ProfileCard } from "./UserProfileCard";
import { PictureGrid } from "./PictureGrid";
import { PostText } from "./PostText";
import { PostFooter } from "./PostFooter";
import { useFetchPostWithPasswordMutation, useGetSinglePostQuery, useLazyGetSinglePostQuery } from "@services";
import { useDispatch } from "react-redux";
import { updatePostInList } from "store/postsSlice";

interface Props {
  isDisabled?: boolean;
  isEditPost?: boolean;
  content?: string;
  images?: string[];
  username?: string;
  id: string;
  isLocked?: boolean;
  createdAt?: string;
  comments?: number;
  likes?: number;
}

export const PostCard: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState<string>("");

  const [
    fetchPostWithPassword,
    {
      data: createPostResponseData,
      error: createPostError,
      isError: isCreatePostError,
      isLoading: isCreatingPost,
    },
  ] = useFetchPostWithPasswordMutation();

  const unlockPost = async () => {
    const response = await fetchPostWithPassword({ postId: props.id, password: password }).unwrap();
    if (response) {
      dispatch(updatePostInList({
        ...response,
        isLocked: false,
      }));
    }
  }

  const unlockForm = (
    <Box display={'flex'} padding={'10px'} borderRadius={'10px'} flexDirection={'column'} w={'100%'} background={
      '#f1f1f1'
    }>
      <Text fontWeight={'700'} paddingBottom={'10px'}>This post is locked. </Text>
      <input
        type="password"
        style={{
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <Button style={{
        background: '#333',
        color: '#fff',
        padding: '10px',
        width: '10%',
        borderRadius: '5px',

      }} onClick={() => unlockPost()}>Unlock</Button>
    </Box>
  );


  return (
    <div className="flex flex-col border-gray-400 rounded-sm border-solid border-[1px] p-2 gap-2 h-max w-full">
      <ProfileCard createdAt={props.createdAt} username={props.username} />
      {props.isLocked ? unlockForm :
        (
          <>
            <PostText content={props.content || ''} />
            <PictureGrid images={
              props.images || []
            } />
          </>
        )
      }
      <PostFooter
        comments={props.comments || 0}
        isLiked={false}
        likes={props.likes || 0}
        showComments={true}
        isCommentDisabled={false}
        isDisabled={false}
        isEditPost={false}
        isLikeDisabled={false}
      />
    </div>
  );
};

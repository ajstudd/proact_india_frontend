import React, { useState, useEffect, useRef } from "react";
import { Box, Button, HStack, Spinner, Text } from "@chakra-ui/react";
import { FiImage, FiLock } from "react-icons/fi";
import { GlobalModal } from "./GlobalModal";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useDispatch } from "react-redux";
import { addPost, setCreatePostData, setPosts } from "store/postsSlice";
import { useCreatePostMutation } from "services/postApi";
import { useSaveImageMutation } from "@services";

interface Props {
  isDisabled: boolean;
  isEditPost: boolean;
  openLockModal: () => void;
}

const MAX_FILESIZE = 9240000;

function returnFileSize(size: number) {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size >= 1024 && size < 1048576) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else if (size >= 1048576) {
    return `${(size / 1048576).toFixed(1)} MB`;
  }
}

export const PostWizard: React.FC<Props> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const [
    createPost,
    {
      data: createPostResponseData,
      error: createPostError,
      isError: isCreatePostError,
      isLoading: isCreatingPost,
    },
  ] = useCreatePostMutation();
  const [saveFile, { isLoading: isFileSaving, isSuccess, isUninitialized }] =
    useSaveImageMutation();
  const createPostData = useSelector(
    (state: RootState) => state.postsSlice.createPostData
  );
  const [fileUrl, setFileUrl] = React.useState<string>("");
  const [selectedFileUrl, setSelectedFileUrl] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const fileFormats = ".jpg, .jpeg, .png";
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const fileExtension = `.${e.target.files[0].type.split("/")[1]}`;
    if (fileFormats) {
      if (!fileFormats.includes(fileExtension)) {
        console.log("File format not supported.");
        setError(
          `File format not supported. Input file format: ${fileExtension}`
        );
        return;
      }
    }
    const selectedFile = e.target.files ? e.target.files[0] : "";
    const objectURL = selectedFile ? URL.createObjectURL(selectedFile) : "";

    if (selectedFile) {
      if (MAX_FILESIZE && selectedFile.size > MAX_FILESIZE) {
        console.log("File size exceeding limit.");
        setError(
          `File size exceeding limit. Input file size: ${returnFileSize(
            selectedFile.size
          )}`
        );
      } else {
        setFileUrl(objectURL);
        setSelectedFileUrl(objectURL);
        setSelectedFile(selectedFile);
        setError("");
      }
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setCreatePostData({
        content: event.target.value,
      })
    );
  };

  const createPostHandler = async () => {
    try {
      let imageRes = null;
      if (selectedFile) {
        const form = new FormData();
        form.append("image", selectedFile);
        imageRes = await saveFile(form as any).unwrap();
      }
      const resp = await createPost({
        title: createPostData.title,
        content: createPostData.content,
        password: createPostData.password,
        isLocked: createPostData.isLocked,
        visibleTo: createPostData.visibleTo,
        images: imageRes ? [imageRes.image._id] : [],
      }).unwrap();
      console.log("resp", resp);
      if (resp) {
        dispatch(
          addPost({
            ...resp,
            isLocked: createPostData.isLocked,
            images: resp.images ? resp.images : [],
            createdAt: new Date().toISOString(),
            comments: [],
          })
        );
        setFileUrl("");
        setSelectedFileUrl("");
        setSelectedFile(null);
        imagePickerRef.current!.value = "";
        dispatch(
          setCreatePostData({
            title: "",
            content: "",
            password: "",
            isLocked: false,
            visibleTo: [],
            images: [],
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const lockPostForm = () => {
    return (
      <div className="flex flex-col w-[100%] gap-2">
        <Text>Lock The Post With Password</Text>
        <input
          className="w-full bg-gray-100 rounded-sm p-2 overflow-hidden focus:outline-none"
          placeholder="Enter Password"
          name="password"
          value={createPostData.password}
          onChange={(e) => {
            dispatch(
              setCreatePostData({
                password: e.target.value,
              })
            );
          }}
        />
        <div className="flex flex-row justify-between">
          <Button
            background={"#C800FF"}
            padding={"4px"}
            rounded={"4px"}
            onClick={() => {
              dispatch(
                setCreatePostData({
                  isLocked: true,
                })
              );
              setShowModal(false);
            }}
            _hover={{
              background: "#A300CC",
            }}
            color={"white"}
          >
            <Text fontWeight={"500"}>Lock</Text>
          </Button>
          <Button
            background={"#F67280"}
            padding={"4px"}
            rounded={"4px"}
            onClick={() => {
              dispatch(
                setCreatePostData({
                  isLocked: false,
                  password: "",
                })
              );
              setShowModal(false);
            }}
            _hover={{
              background: "#F5606F",
            }}
            color={"white"}
          >
            <Text fontWeight={"500"}>Cancel</Text>
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (textareaRef.current?.style) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [createPostData.content]);

  return (
    <div className="flex flex-col border-gray-400 rounded-sm border-solid border-[1px] p-2 gap-2 h-max w-full">
      <Text fontWeight={'600'}>Create Post</Text>
      <textarea
        ref={textareaRef}
        className="w-full resize-none bg-gray-100 rounded-sm p-2 overflow-hidden focus:outline-none"
        placeholder="Write your post here"
        value={createPostData.content}
        onChange={handleChange}
      ></textarea>
      <HStack gap={"10px"}>
        <Box
          padding={"5px"}
          background={"#DEDEDE"}
          _hover={{
            background: "#C4C4C4",
          }}
          onClick={() => imagePickerRef.current?.click()}
          cursor={"pointer"}
          rounded={"10%"}
        >
          <FiImage />
        </Box>
        <Box
          padding={"5px"}
          background={createPostData.isLocked ? "#59A5D8" : "#DEDEDE"}
          _hover={{
            background: "#C4C4C4",
          }}
          onClick={() => setShowModal(!showModal)}
          cursor={"pointer"}
          rounded={"10%"}
        >
          {" "}
          <FiLock />
        </Box>
      </HStack>
      <input
        className={"hidden"}
        type="file"
        ref={imagePickerRef}
        size={MAX_FILESIZE}
        accept={fileFormats ?? ""}
        onChange={onSelectFile}
      />
      {fileUrl && (
        <div className="flex flex-col gap-2">
          <img
            src={fileUrl}
            alt="Selected File"
            className="w-40 h-40 object-cover"
          />
          <Button
            background={"#C80"}
            padding={"4px"}
            className="w-40"
            rounded={"4px"}
            _hover={{
              background: "#C70",
            }}
            onClick={() => {
              setFileUrl("");
              setSelectedFileUrl("");
              setSelectedFile(null);
              imagePickerRef.current!.value = "";
            }}
            color={"white"}
          >
            <Text fontWeight={"500"}>Remove</Text>
          </Button>
        </div>
      )}
      <Button
        background={"#C800FF"}
        padding={"4px"}
        rounded={"4px"}
        onClick={createPostHandler}
        _hover={{
          background: "#A300CC",
        }}
        display={"flex"}
        flexDirection={"row"}
        gap={"5px"}
        disabled={props.isDisabled}
        color={"white"}
      >
        {isCreatingPost ? (
          <Spinner color="#ffffff" size={"xl"} thickness="2px" />
        ) : null}
        <Text fontWeight={"500"}>Post</Text>
      </Button>
      <GlobalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        content={lockPostForm()}
        key={"test"}
      />
    </div>
  );
};

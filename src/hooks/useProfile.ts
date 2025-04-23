import { useState } from "react";
import {
  useEditProfileMutation,
  useGetUserProfileQuery,
  useVerifyEmailChangeMutation,
  useGetUserCommentsQuery,
  useGetBookmarkedProjectsQuery,
  useGetUserProjectsQuery,
} from "../services/userApi";
import { useUserState } from "./useUserState";
import useCurrentUser from "./useCurrentUser";

export const useProfile = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { updateUser } = useUserState();
  const { userId } = useCurrentUser();

  // Get user profile
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery();

  // Edit profile
  const [
    editProfile,
    {
      isLoading: isEditProfileLoading,
      isSuccess: isEditProfileSuccess,
      error: editProfileError,
      data: editProfileData,
    },
  ] = useEditProfileMutation();

  // Verify email change
  const [
    verifyEmailChange,
    {
      isLoading: isVerifyEmailLoading,
      isSuccess: isVerifyEmailSuccess,
      error: verifyEmailError,
    },
  ] = useVerifyEmailChangeMutation();

  // Get user comments
  const {
    data: userComments,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useGetUserCommentsQuery(userId!, {
    skip: !userId,
  });

  // Get bookmarked projects
  const {
    data: bookmarkedProjects,
    isLoading: isBookmarksLoading,
    error: bookmarksError,
    refetch: refetchBookmarks,
  } = useGetBookmarkedProjectsQuery();

  // Get user projects
  const {
    data: userProjects,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useGetUserProjectsQuery();

  const handleProfileUpdate = async (formData: FormData) => {
    try {
      const result = await editProfile(formData).unwrap();
      if (result && result.user) {
        updateUser({
          name: result.user.name,
          photo: result.user.photo,
          phone: result.user.phone,
          email: result.user.email,
        });
      }
      return result;
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  const handleEmailVerification = async (token: string, email: string) => {
    try {
      const result = await verifyEmailChange({ token, email }).unwrap();
      if (result.user) {
        updateUser({
          email: result.user.email,
          isVerified: result.user.isVerified,
        });
      }
      return result;
    } catch (err) {
      console.error("Email verification failed:", err);
      throw err;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    profileData,
    isProfileLoading,
    profileError,
    refetchProfile,
    editProfile: handleProfileUpdate,
    isEditProfileLoading,
    isEditProfileSuccess,
    editProfileError,
    editProfileData,
    verifyEmailChange: handleEmailVerification,
    isVerifyEmailLoading,
    isVerifyEmailSuccess,
    verifyEmailError,
    userComments,
    isCommentsLoading,
    commentsError,
    refetchComments,
    bookmarkedProjects,
    isBookmarksLoading,
    bookmarksError,
    refetchBookmarks,
    userProjects,
    isProjectsLoading,
    projectsError,
    refetchProjects,
    imagePreview,
    handleImageChange,
    setImagePreview,
  };
};

export default useProfile;

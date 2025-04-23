import {
  useUpdateUserMutation,
  useEditProfileMutation,
  useVerifyEmailChangeMutation,
} from "../services/userApi";

export const useUser = () => {
  const [
    updateUser,
    {
      data: userUpdateData,
      error: userUpdateError,
      isError: isUserUpdateError,
      isLoading: isUserUpdateLoading,
      isSuccess: isUserUpdateSuccess,
    },
  ] = useUpdateUserMutation();

  const [
    editProfile,
    {
      data: editProfileData,
      error: editProfileError,
      isError: isEditProfileError,
      isLoading: isEditProfileLoading,
      isSuccess: isEditProfileSuccess,
    },
  ] = useEditProfileMutation();

  const [
    verifyEmail,
    {
      data: verifyEmailData,
      error: verifyEmailError,
      isError: isVerifyEmailError,
      isLoading: isVerifyEmailLoading,
      isSuccess: isVerifyEmailSuccess,
    },
  ] = useVerifyEmailChangeMutation();

  return {
    // Original methods
    updateUser,
    isUserUpdateLoading,
    isUserUpdateError,
    isUserUpdateSuccess,
    userUpdateData,
    userUpdateError,

    // New profile methods
    editProfile,
    isEditProfileLoading,
    isEditProfileError,
    isEditProfileSuccess,
    editProfileData,
    editProfileError,

    // Email verification
    verifyEmail,
    isVerifyEmailLoading,
    isVerifyEmailError,
    isVerifyEmailSuccess,
    verifyEmailData,
    verifyEmailError,
  };
};

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { saveUser, clearUser, setUserAuthentication } from "../store/userSlice";
import { useLogoutMutation } from "../services/authApi";
import { clearAuthData } from "../utils/authUtils";

/**
 * Custom hook to manage user state throughout the application
 */
export const useUserState = () => {
  const user = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  /**
   * Updates user state in Redux store
   */
  const updateUser = (userData: Partial<typeof user>) => {
    dispatch(saveUser(userData));
  };

  /**
   * Handles user logout - clears state and localStorage
   */
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      clearAuthData();
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if API call fails
      dispatch(clearUser());
      clearAuthData();
    }
  };

  /**
   * Sets authentication status
   */
  const setAuthenticated = (status: boolean) => {
    dispatch(setUserAuthentication(status));
  };

  return {
    user,
    updateUser,
    handleLogout,
    setAuthenticated,
    isAuthenticated: user.isAuthenticated || false,
  };
};

export default useUserState;

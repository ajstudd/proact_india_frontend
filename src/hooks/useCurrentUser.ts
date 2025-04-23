import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../contexts/AuthContext";

/**
 * Hook to provide access to the currently authenticated user
 */
export const useCurrentUser = () => {
  const userState = useSelector((state: RootState) => state.userSlice);
  const auth = useAuth();

  return {
    user: userState,
    isAuthenticated: userState.isAuthenticated,
    userId: userState?.id,
    userRole: userState?.role,
    isAdmin: auth.isAdmin,
    isGovernment: auth.isGovernment,
    isContractor: auth.isContractor,
    isUser: auth.isUser,
    canManageProjects: auth.isAdmin || auth.isGovernment,
    canEditProjects: auth.isAdmin || auth.isGovernment || auth.isContractor,
  };
};

export default useCurrentUser;

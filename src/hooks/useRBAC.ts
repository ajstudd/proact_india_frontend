import { useAuth } from "../contexts/AuthContext";
import {
  Permission,
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
} from "../utils/rbac";
import { IUserData } from "../types";

/**
 * Custom hook that provides role-based access control functionality
 */
export const useRBAC = () => {
  const auth = useAuth();
  const userData = auth.getUserData();

  /**
   * Check if the current user has a specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    return userHasPermission(userData, permission);
  };

  /**
   * Check if the current user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return userHasAnyPermission(userData, permissions);
  };

  /**
   * Check if the current user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return userHasAllPermissions(userData, permissions);
  };

  /**
   * Check if the current user has a specific role
   */
  const hasRole = (role: IUserData["role"]): boolean => {
    return userData?.role === role;
  };

  /**
   * Check if the current user has any of the specified roles
   */
  const hasAnyRole = (roles: Array<IUserData["role"]>): boolean => {
    return !!userData?.role && roles.includes(userData.role);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin: auth.isAdmin,
    isUser: auth.isUser,
    isContractor: auth.isContractor,
    isGovernment: auth.isGovernment,
    isVerified: !!auth.user?.decodedToken?.isVerified,
    userData,
  };
};

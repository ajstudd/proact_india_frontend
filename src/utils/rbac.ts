import { IUserData } from "../types";

//LABEL: Role Based Access Control
/**
 * Permission types that can be assigned in the application
 */
export type Permission =
  | "create:project"
  | "edit:project"
  | "delete:project"
  | "approve:project"
  | "view:admin-dashboard"
  | "manage:users"
  | "approve:contractors"
  | "submit:proposals"
  | "view:reports"
  | "manage:department"
  | "create:post"
  | "edit:post"
  | "delete:post";

/**
 * User role types in the application
 */
export type UserRole = "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT";

/**
 * Maps permissions to user roles
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "create:project",
    "edit:project",
    "delete:project",
    "approve:project",
    "view:admin-dashboard",
    "manage:users",
    "approve:contractors",
    "view:reports",
    "create:post",
    "edit:post",
    "delete:post",
  ],
  GOVERNMENT: [
    "create:project",
    "edit:project",
    "approve:project",
    "view:reports",
    "manage:department",
    "create:post",
    "edit:post",
  ],
  CONTRACTOR: ["submit:proposals", "view:reports", "create:post"],
  USER: [],
};

/**
 * Checks if a role has specific permission
 * @param role User role to check
 * @param permission Permission to verify
 * @returns boolean indicating if the role has the permission
 */
export const hasPermission = (
  role: UserRole | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Checks if a user has specific permission
 * @param user User data
 * @param permission Permission to verify
 * @returns boolean indicating if the user has the permission
 */
export const userHasPermission = (
  user: Partial<IUserData> | null,
  permission: Permission
): boolean => {
  if (!user?.role) return false;
  return hasPermission(user.role, permission);
};

/**
 * Checks if user has any of the specified permissions
 * @param user User data
 * @param permissions Array of permissions to check
 * @returns boolean indicating if the user has any of the permissions
 */
export const userHasAnyPermission = (
  user: Partial<IUserData> | null,
  permissions: Permission[]
): boolean => {
  if (!user?.role) return false;
  return permissions.some((permission) => hasPermission(user.role, permission));
};

/**
 * Checks if user has all of the specified permissions
 * @param user User data
 * @param permissions Array of permissions to check
 * @returns boolean indicating if the user has all of the permissions
 */
export const userHasAllPermissions = (
  user: Partial<IUserData> | null,
  permissions: Permission[]
): boolean => {
  if (!user?.role) return false;
  return permissions.every((permission) =>
    hasPermission(user.role, permission)
  );
};

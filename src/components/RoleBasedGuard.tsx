import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Permission, userHasPermission, userHasAnyPermission, userHasAllPermissions } from '../utils/rbac';
import { IUserData } from '../types';

interface RoleBasedGuardProps {
    children: ReactNode;
    fallback?: ReactNode;

    // Role-based access
    roles?: Array<IUserData['role']>;
    anyRole?: boolean; // If true, user needs any of the roles (default)
    allRoles?: boolean; // If true, user needs all roles

    // Permission-based access (more granular)
    permissions?: Permission[];
    anyPermission?: boolean; // If true, user needs any permission (default)
    allPermissions?: boolean; // If true, user needs all permissions

    // Verification requirement
    requireVerified?: boolean;
}

/**
 * Component that renders content conditionally based on user's roles and permissions
 */
const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({
    children,
    fallback = null,
    roles = [],
    anyRole = true,
    allRoles = false,
    permissions = [],
    anyPermission = true,
    allPermissions = false,
    requireVerified = false,
}) => {
    const auth = useAuth();
    const { isAuthenticated, userRole, user } = auth;

    // If not authenticated, don't show protected content
    if (!isAuthenticated) return <>{fallback}</>;

    // If verification is required but user is not verified
    if (requireVerified && !user.decodedToken?.isVerified) return <>{fallback}</>;

    let hasAccess = true;

    // Check role-based access
    if (roles.length > 0) {
        if (allRoles) {
            // User must have all specified roles
            hasAccess = roles.every(role => role === userRole);
        } else if (anyRole) {
            // User must have any of the specified roles
            hasAccess = roles.includes(userRole as IUserData['role']);
        }
    }

    // Check permission-based access (more granular control)
    if (hasAccess && permissions.length > 0) {
        const userData = auth.getUserData();

        if (allPermissions) {
            // User must have all permissions
            hasAccess = userHasAllPermissions(userData, permissions);
        } else if (anyPermission) {
            // User must have any of the permissions
            hasAccess = userHasAnyPermission(userData, permissions);
        }
    }

    return <>{hasAccess ? children : fallback}</>;
};

export default RoleBasedGuard;

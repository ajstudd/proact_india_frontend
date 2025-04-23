import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import { saveUser, setUserAuthentication, clearUser } from "../store/userSlice";
import { getCurrentUserId, getAuthToken, clearAuthData } from "../utils/authUtils";
import { useMeQuery } from "../services/authApi";
import { IUserData } from "../types";

interface DecodedToken {
    userId: string;
    role: string;
    exp: number; // Expiration timestamp
}

interface AuthContextType {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: any;
    refreshUserData: () => Promise<void>;
    getAuthStatus: () => {
        token: string | null;
        userId: string | null;
        isAuthenticated: boolean;
        userRole: string | undefined;
    };
    token: string | null;
    userId: string | null;
    userRole?: string;
    // Added from useAuth hook
    logout: () => void;
    hasRole: (role: "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT") => boolean;
    getUserData: () => Partial<IUserData> | null;
    isAdmin: boolean;
    isContractor: boolean;
    isGovernment: boolean;
    isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode, publicPages?: string[] }> = ({
    children,
    publicPages = []
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();

    const token = getAuthToken();
    const userId = getCurrentUserId();

    const [authState, setAuthState] = useState<{
        isAuthenticated: boolean;
        user: DecodedToken | null;
    }>({
        isAuthenticated: false,
        user: null,
    });

    const {
        data: responseData,
        isSuccess,
        refetch,
    } = useMeQuery(token || "", {
        skip: !token,
    });
    const userData = responseData?.user;
    useEffect(() => {
        const initializeAuth = async () => {
            if (!token) {
                // No token found, user is not authenticated
                dispatch(setUserAuthentication(false));

                // Check if current path matches any public page pattern
                const isPublicPage = publicPages.some(publicPath => {
                    // Handle exact matches
                    if (publicPath === pathname) return true;

                    // Handle dynamic routes like /project/[id] or /otp/[email]
                    if (publicPath.includes('[')) {
                        const baseRoute = publicPath.split('/[')[0];
                        return pathname?.startsWith(baseRoute);
                    }
                    return false;
                });

                // If not on a public page, redirect to login
                if (!isPublicPage) {
                    console.log("Redirecting to login");
                    router.replace("/login");
                }

                setIsLoading(false);
                return;
            }

            try {
                // Decode and verify token
                const decoded: DecodedToken = jwtDecode(token);

                if (decoded.exp * 1000 < Date.now()) {
                    // Token is expired
                    localStorage.removeItem("authData");
                    dispatch(setUserAuthentication(false));
                    router.replace("/login");
                } else {
                    // Valid token
                    setAuthState({ isAuthenticated: true, user: decoded });

                    // If we have user data from API
                    if (isSuccess && userData) {
                        dispatch(
                            saveUser({
                                id: userData._id,
                                name: userData.name,
                                email: userData.email,
                                phone: userData.phone,
                                photo: userData.photo,
                                role: userData.role || decoded.role, // Use role from token as fallback
                                isAuthenticated: true,
                                isVerified: userData.isVerified,
                                designation: userData.designation,
                                department: userData.department,
                                experience: userData.experience,
                                reputationScore: userData.reputationScore,
                            })
                        );
                    }
                }
            } catch (error) {
                console.error("Invalid JWT Token", error);
                localStorage.removeItem("authData");
                dispatch(setUserAuthentication(false));
                router.replace("/login");
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, [token, userId, isSuccess, userData, dispatch, pathname, router, publicPages]);

    // Function to refresh user data
    const refreshUserData = async () => {
        if (token) {
            await refetch();
        }
    };

    // Function to check if the user is authenticated
    const getAuthStatus = () => {
        return {
            token: getAuthToken(),
            userId: getCurrentUserId(),
            isAuthenticated: Boolean(token) && authState.isAuthenticated,
            userRole: authState.user?.role,
        };
    };

    // Added from useAuth hook
    const logout = () => {
        clearAuthData();
        dispatch(clearUser());
        router.replace("/login");
    };

    const hasRole = (role: "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT") => {
        return authState.user?.role === role;
    };

    const getUserData = (): Partial<IUserData> | null => {
        if (!token || !authState.isAuthenticated) return null;

        return {
            id: userId || "",
            role: authState.user?.role as IUserData["role"],
        };
    };

    const userRole = authState.user?.role;

    const value = {
        isLoading,
        isAuthenticated: Boolean(token) && authState.isAuthenticated,
        user: {
            decodedToken: authState.user,
        },
        refreshUserData,
        getAuthStatus,
        token,
        userId,
        userRole,
        // Added from useAuth hook
        logout,
        hasRole,
        getUserData,
        isAdmin: userRole === "ADMIN",
        isContractor: userRole === "CONTRACTOR",
        isGovernment: userRole === "GOVERNMENT",
        isUser: userRole === "USER",
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

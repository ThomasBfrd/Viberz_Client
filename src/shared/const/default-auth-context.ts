import type {AuthContextInterface} from "../../core/interfaces/auth-context.interface.ts";

export const defaultAuthContext: AuthContextInterface = {
    jwtToken: null,
    userId: null,
    refreshToken: null,
    expiresAt: null,
    isLoggedIn: false,
    user: null,
    setUser: () => {
        throw new Error("AuthContext not initialized");
    },
    login: () => {
        throw new Error("AuthContext not initialized");
    },
    logout: () => {
        throw new Error("AuthContext not initialized");
    },
    refreshAccessToken: () => {
        throw new Error("AuthContext not initialized");
    },
};
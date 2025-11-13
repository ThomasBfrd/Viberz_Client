import type {AuthContextInterface} from "../../../core/interfaces/auth-context.interface.ts";

export const mockAuthContext: AuthContextInterface = {
    jwtToken: "fake-token",
    userId: "fake-user-id",
    refreshToken: null,
    expiresAt: null,
    isLoggedIn: true,
    user: null,
    setUser: () => {
    },
    login: () => {
    },
    logout: () => {
    },
    refreshAccessToken: () => {
    }
};
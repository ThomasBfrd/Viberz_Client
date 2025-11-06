import {type Context, createContext, type ReactNode, useCallback, useEffect, useState} from "react";
import type {UserInfos} from "../../shared/interfaces/user.interface.ts";
import type {AuthData} from "../interfaces/auth-data.interface.ts";
import type {AuthContextInterface, RefreshTokenDTO} from "../interfaces/auth-context.interface.ts";

export const defaultAuthContext: AuthContextInterface = {
    jwtToken: null,
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

const AuthContext: Context<AuthContextInterface> = createContext(defaultAuthContext);

function AuthProvider({children}: { children: ReactNode}) {
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [user, setUserInfos] = useState<UserInfos | null>(null);

    // Vérifie si le token est encore valide
    const isLoggedIn =
        !!jwtToken && !!expiresAt && Date.now() < expiresAt;

    // --- LOGIN ---
    const login = (data: AuthData) => {
        const expiry = Date.now() + 5 * 1000;
        const authStorage: string | null = localStorage.getItem("auth");
        let parsed: string = "";

        if (authStorage) {
            parsed = JSON.parse(authStorage).refreshToken
        }

        const refreshToken: string = parsed && !data.refreshToken ? parsed : data.refreshToken;
        setJwtToken(data.jwtToken);
        setRefreshToken(data.refreshToken);
        setExpiresAt(expiry);

        localStorage.setItem(
            "auth",
            JSON.stringify({
                jwtToken: data.jwtToken,
                refreshToken: refreshToken,
                expiresIn: expiry,
                userId: data.userId,
            })
        );
    };

    // --- LOGOUT ---
    const logout = () => {
        setJwtToken(null);
        setRefreshToken(null);
        setExpiresAt(null);
        setUserInfos(null);
        localStorage.removeItem("auth");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    };

    // --- SET USER ---
    const setUser = (userData: UserInfos) => {
        setUserInfos(userData);
    };

    // --- REFRESH TOKEN ---
    const refreshAccessToken = useCallback(async () => {
        if (!refreshToken) return;

        try {
            const bodyRequest: RefreshTokenDTO = {
                refreshToken: refreshToken,
                clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/refreshSpotifyToken`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest),
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            const data: AuthData = await response.json();
            return login(data);
        } catch (error) {
            console.error("Refresh token failed", error);
            logout();
        }
    }, [refreshToken]);

    // --- AUTO LOGIN AU MONTAGE ---
    useEffect(() => {
        const stored: string | null = localStorage.getItem("auth");
        if (!stored && window.location.pathname !== "/home" && !window.location.pathname.includes("/callback")) {
            return window.location.replace("/home");
        }

        if (stored) {
            const parsed = JSON.parse(stored);
            setJwtToken(parsed.jwtToken);
            setRefreshToken(parsed.refreshToken);
            setExpiresAt(parsed.expiresIn);
        }
    }, []);

    // Déclenche le refresh une fois que le refreshToken est en state
    useEffect(() => {
        if (!refreshToken) return;
        if (!expiresAt || Date.now() >= expiresAt) {
            refreshAccessToken().then();
        }
    }, [refreshToken, expiresAt, refreshAccessToken]);

    const value: AuthContextInterface = {
        jwtToken,
        refreshToken,
        expiresAt,
        isLoggedIn,
        user,
        setUser,
        login,
        logout,
        refreshAccessToken
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
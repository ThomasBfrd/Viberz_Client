import {type Context, createContext, type ReactNode, useCallback, useEffect, useState} from "react";
import type {UserInfos} from "../../shared/interfaces/user.interface.ts";
import type {AuthData} from "../interfaces/auth-data.interface.ts";
import type {AuthContextInterface, RefreshTokenDTO} from "../interfaces/auth-context.interface.ts";
import {setupFetchInterceptor} from "../../shared/utils/setupFetchInterceptor.ts";
import {defaultAuthContext} from "../../shared/const/default-auth-context.ts";

const AuthContext: Context<AuthContextInterface> = createContext(defaultAuthContext);

function AuthProvider({children}: { children: ReactNode}) {
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [user, setUserInfos] = useState<UserInfos | null>(null);

    // Vérifie si le token est encore valide
    const isLoggedIn =
        !!jwtToken && !!expiresAt && Date.now() < expiresAt;

    // --- LOGIN ---
    const login = useCallback((data: AuthData) => {
        const expiry = Date.now() + 5 * 1000;

        setJwtToken(data.jwtToken);
        setRefreshToken(data.refreshToken);
        setUserId(data.userId);
        setExpiresAt(expiry);

        localStorage.setItem(
            "auth",
            JSON.stringify({
                jwtToken: data.jwtToken,
                refreshToken: data.refreshToken,
                expiresIn: expiry,
                userId: data.userId,
            })
        );


    }, []);

    // --- LOGOUT ---
    const logout = useCallback(() => {
        setJwtToken(null);
        setRefreshToken(null);
        setExpiresAt(null);
        setUserInfos(null);
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
    }, []);

    // --- SET USER ---
    const setUser = useCallback((userData: UserInfos) => {
        setUserInfos(userData);
    }, []);

    // --- REFRESH TOKEN ---
    const refreshAccessToken = useCallback(async () => {

        if (!refreshToken) {
            console.warn("No refresh token available");
            return;
        }

        try {
            const bodyRequest: RefreshTokenDTO = {
                clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
                refreshToken: refreshToken
            }
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/refreshSpotifyToken`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyRequest),
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            const data: AuthData = await response.json();

            if (!data.refreshToken) {
                data.refreshToken = refreshToken;
            }

            login(data);

        } catch (error) {
            console.error("Refresh token failed", error);
            logout();
        }
    }, [login, refreshToken, logout]);

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
            setUserId(parsed.userId);
        }
    }, []);

    useEffect(() => {
        setupFetchInterceptor(
            () => jwtToken,
            () => expiresAt,
            refreshAccessToken
        );
    }, [expiresAt, jwtToken, refreshAccessToken]);

    const value: AuthContextInterface = {
        jwtToken,
        refreshToken,
        expiresAt,
        isLoggedIn,
        userId,
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
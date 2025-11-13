import type {UserInfos} from "../../shared/interfaces/user.interface.ts";
import type {AuthData} from "./auth-data.interface.ts";

export interface RefreshTokenDTO {
    clientId: string;
    refreshToken: string;
}

export interface AuthContextInterface {
    jwtToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    isLoggedIn: boolean;
    userId: string | null;
    user: UserInfos | null;
    setUser: (userData: UserInfos) => void;
    login: (data: AuthData) => void;
    logout: () => void;
    refreshAccessToken: (refresh: RefreshTokenDTO) => void;
}

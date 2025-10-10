export interface AuthData {
    jwtToken: string;
    refreshToken: string;
    expiresIn: number;
    userId: string;
}

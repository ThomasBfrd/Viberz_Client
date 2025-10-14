export const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const VITE_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
export const VITE_REDIRECT_URI = import.meta.env.REDIRECT_URI ?? "";
export const VITE_AUTH_ENDPOINT = import.meta.env.AUTH_ENDPOINT
export const VITE_RESPONSE_TYPE = import.meta.env.RESPONSE_TYPE
export const VITE_SCOPES = import.meta.env.SCOPES ?? ""
export const url: string = `${VITE_AUTH_ENDPOINT}?client_id=${VITE_CLIENT_ID}&redirect_uri=${encodeURIComponent(VITE_REDIRECT_URI)}&response_type=${VITE_RESPONSE_TYPE}&scope=${encodeURIComponent(VITE_SCOPES)}&show_dialog=true`;
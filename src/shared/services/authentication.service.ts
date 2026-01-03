export function initiateSpotifyAuth() {
    const redirect: string = `https://${import.meta.env.VITE_CLIENT_URL}${import.meta.env.VITE_REDIRECT_URI}`
    const params = new URLSearchParams({
            response_type: import.meta.env.VITE_RESPONSE_TYPE,
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            scope: import.meta.env.VITE_SCOPES,
            redirect_uri: redirect
        });

        return window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}
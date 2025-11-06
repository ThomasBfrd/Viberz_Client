export function initiateSpotifyAuth() {
        const params = new URLSearchParams({
            response_type: import.meta.env.VITE_RESPONSE_TYPE,
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            scope: import.meta.env.VITE_SCOPES,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI
        });

        return window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}
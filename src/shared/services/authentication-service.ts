export function initiateSpotifyAuth() {
        const params = new URLSearchParams({
            response_type: import.meta.env.VITE_RESPONSE_TYPE,
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            scope: import.meta.env.VITE_SCOPES,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI
        });

        return window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function getRefreshToken() {
    const refreshToken: string | null = localStorage.getItem('refreshToken');
    const url: string = `https://localhost:7214/refreshSpotifyToken`;

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken ?? "",
            client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID
        })
    }

    const body = await fetch(url, payload);
    const response = await body.json();

    if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
    }
}
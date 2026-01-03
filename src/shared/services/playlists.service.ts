const PlaylistsService = {
    likePlaylist: async (playlistId: string, jwtToken: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/playlist/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playlistId)
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return null;
            }

            const data: boolean = await response.json();

            return data;
        } catch (e: unknown) {
            throw new Error("Erreur", e as Error);
        }
    }
};

export default PlaylistsService;
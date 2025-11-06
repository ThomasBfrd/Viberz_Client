import type {ArtistSearchResponse} from "../components/modal-search-artists/modal-artists.tsx";

const artistService = {
    getSearchedArtists: async (accessToken: string, search: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search?artist=${search.toLowerCase()}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                })
                const artists: ArtistSearchResponse[] = await response.json();
                return artists;
        }
        catch (error) {
            console.error(error);
        }
    }
}

export default artistService;
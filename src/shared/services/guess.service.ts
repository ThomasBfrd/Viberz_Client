import type {ACTIVITY_TYPE} from "../enums/activities.enum.ts";

const guessService = {
    getSongs: async (accessToken: string, gameType: ACTIVITY_TYPE, genres?: string[]) => {
        const params = new URLSearchParams();
        if (genres) {
            genres.forEach(genre => params.append("definedGenre", genre));
        }
        try {
            const response: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/guess${genres ? `?gameType=${gameType}&${params}` : `?gameType=${gameType}`}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des genres:', error);
            return [];
        }
    }
}

export default guessService;

const genresService = {
    getGenres: async (accessToken: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/genres/getGenres`, {
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

export default genresService;

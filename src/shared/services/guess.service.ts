const guessService = {
    guessGenre: async (accessToken: string) => {
        try {
            const response = await fetch('https://localhost:7214/api/guess/guess-genre', {
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

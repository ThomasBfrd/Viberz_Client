import type {FetchOptions} from "../hooks/useFetch.tsx";

export const fetchSpotifyAPI = async (options: FetchOptions) => {
    try {
        const response = await fetch(options.url, {
            method: options.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.jwtToken}`
            },
            body: JSON.stringify(options.body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Si le statut est 204 (No Content) ou la réponse est vide, retourner null
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        // Obtenir le texte de la réponse d'abord
        const text = await response.text();

        // Vérifier si le texte est vide
        if (!text) {
            return null;
        }

        // Sinon, parser le texte en JSON
        return JSON.parse(text);
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        throw error;
    }
};
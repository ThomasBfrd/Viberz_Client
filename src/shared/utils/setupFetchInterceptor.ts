// setupFetchInterceptor.ts
let isInterceptorSetup = false;
let refreshPromise: Promise<void> | null = null;

// CORRECTION : Stocker les références pour pouvoir les mettre à jour
let getTokenRef: (() => string | null) | null = null;
let getExpiryRef: (() => number | null) | null = null;
let refreshTokenRef: (() => Promise<void>) | null = null;

export const setupFetchInterceptor = (
    getToken: () => string | null,
    getExpiry: () => number | null,
    refreshToken: () => Promise<void>
) => {
    // CORRECTION : Mettre à jour les références à chaque appel
    getTokenRef = getToken;
    getExpiryRef = getExpiry;
    refreshTokenRef = refreshToken;

    // Setup une seule fois
    if (isInterceptorSetup) {
        return;
    }

    isInterceptorSetup = true;
    const originalFetch = window.fetch;

    window.fetch = async (
        input: RequestInfo | URL,
        init?: RequestInit
    ): Promise<Response> => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

        // NE PAS intercepter l'appel de refresh token
        if (url.includes('/refreshSpotifyToken') ||
            (url.includes('api.spotify.com'))) {
            return originalFetch(input, init);
        }

        // CORRECTION : Utiliser les références à jour
        const expiry = getExpiryRef?.();
        const now = Date.now();

        // Refresh si expiré
        if (expiry && now >= expiry && refreshTokenRef) {
            if (!refreshPromise) {
                refreshPromise = refreshTokenRef().finally(() => {
                    refreshPromise = null;
                });
            }

            await refreshPromise;
        }

        // Récupérer le token APRÈS le potentiel refresh
        const token = getTokenRef?.();

        if (token) {
            init = {
                ...init,
                headers: {
                    ...init?.headers,
                    Authorization: `Bearer ${token}`,
                },
            };
        }

        return originalFetch(input, init);
    };
};

// BONUS : Fonction pour réinitialiser l'interceptor (utile pour les tests)
export const resetFetchInterceptor = () => {
    isInterceptorSetup = false;
    getTokenRef = null;
    getExpiryRef = null;
    refreshTokenRef = null;
};
let isInterceptorSetup = false;
let refreshPromise: Promise<void> | null = null;

let getTokenRef: (() => string | null) | null = null;
let getExpiryRef: (() => number | null) | null = null;
let refreshTokenRef: (() => Promise<void>) | null = null;

export const setupFetchInterceptor = (
    getToken: () => string | null,
    getExpiry: () => number | null,
    refreshToken: () => Promise<void>
) => {

    getTokenRef = getToken;
    getExpiryRef = getExpiry;
    refreshTokenRef = refreshToken;

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

        if (url.includes('/refreshSpotifyAccess') ||
            (url.includes('api.spotify.com'))) {
            return originalFetch(input, init);
        }

        const expiry = getExpiryRef?.();
        const now = Date.now();

        if (expiry && now >= expiry && refreshTokenRef) {
            if (!refreshPromise) {
                refreshPromise = refreshTokenRef().finally(() => {
                    refreshPromise = null;
                });
            }

            await refreshPromise;
        }

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

export const resetFetchInterceptor = () => {
    isInterceptorSetup = false;
    getTokenRef = null;
    getExpiryRef = null;
    refreshTokenRef = null;
};
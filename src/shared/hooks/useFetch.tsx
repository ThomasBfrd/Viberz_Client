import {useCallback, useState} from "react";

export interface FetchResult<T> {
    success: boolean;
    data: T | null;
    error?: unknown;
    aborted?: boolean;
}

export interface FetchOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    jwtToken: string;
};

export function useFetch<T>() {
    const [data, setData] = useState<T | undefined>(undefined as T);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>(undefined);

    const fetchData = useCallback(async (url: string, options: FetchOptions): Promise<FetchResult<T>> => {
        const controller: AbortController = new AbortController();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: options.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${options.jwtToken}`
                },
                body: typeof options.body === "string" ? options.body : JSON.stringify(options.body),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (response.status === 204) {
                setData(null as T);
                return {success: true, data: null};
            }

            let result: T | null = null;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                result = await response.json() as T;
                setData(result);
            }

            return {success: true, data: result};
        }
        catch (error: unknown) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return {success: false, data: null, aborted: true};
            }
            const errorObj = error instanceof Error ? error : new Error('An unknown error occurred.');
            setError(errorObj);
            console.error(errorObj);

            return {success: false, data: null, error: errorObj};
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    return { fetchData, data, isLoading, error };
}
import {useEffect} from "react";

export interface FetchOptions {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    jwtToken: string;
};

export const useFetch = ({url, method, body, jwtToken
}: FetchOptions) => {
    useEffect(() => {
        const controller: AbortController = new AbortController();
        const signal: AbortSignal = controller.signal;
        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: body ?? null,
            signal
        };

        const fetchData = async () => {
            try {
                const response = await fetch(url, fetchOptions);
                return await response.json();
            }
            catch (error: any) {
                if (error.message === 'Aborted') return;
                console.error(error);
            }
        }

        fetchData();

        return () => {
            controller.abort();
        }

    }, [url])
};
export const userAuthService = {
    isWhitelisted: async (email: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/is-whitelisted`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(email)
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return null;
            }

            const data: boolean = await response.json();

            return data;
        }
        catch (error) {
            console.error('Your email address is not whitelisted:', error);
            return null;
        }
    }
}
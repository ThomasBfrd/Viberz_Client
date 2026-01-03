import type {ResultGame} from "../interfaces/result-game.interface.ts";
import type {GameHistory} from "../interfaces/game-history.interface.ts";

const userService = {
    addGameHistory: async (jwtToken: string, gameHistory: GameHistory) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/xp-history`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameHistory)
            });

            const data: ResultGame = await response.json();

            return data;
        } catch (error) {
            console.error("Can't update your progression", error);
        }
    }
}

export default userService;
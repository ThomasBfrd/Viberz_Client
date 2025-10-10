import type {ACTIVITY_TYPE} from "../enums/activities.enum.ts";
import type {ResultGame} from "../../features/pages/guess-genre/guess-genre-page.tsx";

export interface GameHistory {
    earnedXp: number;
    activityType: ACTIVITY_TYPE;
    genre?: string;
    createdAt: string;
}

const userService = {
    addGameHistory: async (jwtToken: string, gameHistory: GameHistory) => {
        console.log(jwtToken);
        try {
            const response = await fetch('https://localhost:7214/api/xp-history/add-history-game', {
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
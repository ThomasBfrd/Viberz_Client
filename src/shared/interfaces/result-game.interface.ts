export interface ResultGame {
    userId: string;
    level: number;
    currentXp: number;
    xpForPreviousLevel: number;
    xpForNextLevel: number;
    gradeName: string;
    levelUp: boolean;
}
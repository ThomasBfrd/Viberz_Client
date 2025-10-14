export interface UserXp {
    userId: string;
    level: number;
    currentXp: number;
    xpForPreviousLevel: number;
    xpForNextLevel: number;
    gradeName: string;
}
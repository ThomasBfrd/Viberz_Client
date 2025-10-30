import type {ACTIVITY_TYPE} from "../enums/activities.enum.ts";

export interface GameHistory {
    earnedXp: number;
    activityType: ACTIVITY_TYPE;
    genre?: string;
    createdAt: string;
}
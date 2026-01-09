export interface GuestContextMock {
    lvl: number;
    xpForPreviousLevel: number;
    xpForNextLevel: number;
    currentXp: number;
    genres: string[];
    artists: string[];
}

export const GUEST_CONTEXT: GuestContextMock = {
    lvl: 3,
    xpForPreviousLevel: 120,
    xpForNextLevel: 250,
    currentXp: 150,
    genres: ["EDM Trap", "Drum & Bass", "Bass House"],
    artists: ["Tisoki, Viperactive, ISOxo"]
};
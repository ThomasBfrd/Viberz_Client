import type {UserXp} from "./user-xp.interface.ts";

export interface UserInfos {
    user: {
        userName: string;
        email: string;
        image: string;
        userType: string;
        favoriteArtists: string[];
        favoriteGenres: string[];
    }
    xp: UserXp;
}
export interface UpdateUser {
    image: string | undefined;
    email: string;
    userName: string;
    favoriteArtists: string[];
    favoriteGenres: string[];
}
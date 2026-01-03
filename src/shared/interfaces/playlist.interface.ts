import type {Song} from "./guess-song.interface.ts";

export interface Playlist {
    id: number;
    spotifyPlaylistId: string;
    accessToken: string;
    userId: string;
    userImageProfile: string;
    userName: string;
    name: string;
    genreList: Array<string>;
    image: string;
    songs: Tracks;
    likes: number;
    likedByUser: boolean;
    imageUrl: string;
}

export interface Tracks {
    tracks: SongItems;
}

export interface SongItems {
    items: Song[];
}
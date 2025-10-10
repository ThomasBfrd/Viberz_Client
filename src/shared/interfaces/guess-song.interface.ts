export interface GuessSong {
    song: Song;
    genre: string;
    accessToken: string;
    earnedXp: number;
    otherGenres: string[];
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Artist {
    id: string;
    name: string;
}

export interface Album {
    images: Image[];
}

export interface Track {
    album: Album;
    artists: Artist[];
    id: string;
    name: string;
    duration_ms: number;
}

export interface Song {
    track: Track;
}
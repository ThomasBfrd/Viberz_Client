export interface RandomGuessSongs {
    randomSong: RandomSong[];
    accessToken: string;
}

export interface RandomSong {
    song: Song;
    genre: string;
    earnedXp: number;
    otherGenres: string[];
    otherSongs: OtherRandomSong[];
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

export interface OtherRandomSong {
    title: string;
    artists: string[];
}
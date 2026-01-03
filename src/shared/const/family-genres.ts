import type {FamilyGenres} from "../interfaces/family-genres.interface.ts";

export const FAMILY_GENRES: FamilyGenres[] = [
    {
        id: 1,
        short: "Bass",
        label: "Bass Music",
        path: "bass",
        value: 0
    },
    {
        id: 2,
        short: "Hard",
        label: "Hard Music",
        path: "hard",
        value: 1
    },
    {
        id: 3,
        short: "House",
        label: "House & Tech",
        path: "house",
        value: 2
    },
    {
        id: 4,
        short: "Edm",
        label: "EDM",
        path: "edm",
        value: 3
    },
    {
        id: 5,
        short: "All",
        label: "All",
        path: "all",
        value: 4
    },
    {
        id: 6,
        short: "My playlists",
        label: "My Playlists",
        path: "my-playlists",
        value: 5
    },
]

export const GENRE_VALUE: Record<FamilyGenres['path'], FamilyGenres['value']> = {
    "bass": 0,
    "hard": 1,
    "house": 2,
    "edm": 3,
    "all": 4,
    "my-playlists": 5
};

export const GENRE_PATH: Record<FamilyGenres['value'], string> = {
    0: "bass",
    1: "hard",
    2: "house",
    3: "edm",
    4: "all",
    5: "my-playlists"
};

export const GENRE_NAME: Record<FamilyGenres['value'], string> = {
    0: "Bass Music",
    1: "Hard Music",
    2: "House & Tech",
    3: "EDM",
    4: "All",
    5: "My Playlists"
};
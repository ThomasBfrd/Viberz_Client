import type {MenuItem} from "../../features/pages/home/home-page.tsx";

export const menuItems: Array<MenuItem> = [
    {
        name: 'Guess the genre',
        type: 'play',
        path: '/guess-genre',
        available: true,
        background: "img/background-1.webp"
    },
    {
        name: 'Guess the song',
        type: 'play',
        path: '/guess-song',
        available: true,
        background: "img/background-2.webp"
    },
    {
        name: 'Share and discover',
        type: 'listen',
        path: '/playlists',
        available: false,
        background: "img/background-3.webp"
    },
    {
        name: 'Learn the structures',
        type: 'learn',
        path: '/learn-structures',
        available: false,
        background: "img/background-4.webp"
    },
]
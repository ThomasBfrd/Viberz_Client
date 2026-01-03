import type {MenuItem} from "../interfaces/menu-item.interface.ts";

export const menuItems: Array<MenuItem> = [
    {
        label: 'Guess the genre',
        short: 'Guess',
        value: 'play',
        path: '/guess-genre',
        available: true,
        background: "img/background-1.webp"
    },
    {
        label: 'Guess the song',
        short: 'Guess',
        value: 'play',
        path: '/guess-song',
        available: true,
        background: "img/background-2.webp"
    },
    {
        label: 'Share & discover',
        short: 'Listen',
        value: 'listen',
        path: '/discover',
        available: true,
        background: "img/background-3.webp"
    },
    {
        label: 'Learn the structures',
        short: 'Learn',
        value: 'learn',
        path: '/learn-structures',
        available: false,
        background: "img/background-4.webp"
    },
]
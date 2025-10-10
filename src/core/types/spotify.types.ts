// app/types/spotify.types.ts
export interface SpotifyProfile {
    id: string;
    display_name: string;
    email: string;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
    followers: {
        total: number;
    };
    country: string;
    product: string;
    external_urls: {
        spotify: string;
    };
}
import type {Track} from "./guess-song.interface.ts";

export interface PlayerProps {
    song: Track | undefined;
    gameType?: string | null;
    resultWave?: boolean;
    accessToken?: string;
    ready?: boolean;
    onPlayingStateChange?: (state: boolean) => void;
}
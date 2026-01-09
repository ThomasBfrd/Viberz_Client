import PlayerUi from "../../../../shared/components/player-ui/player-ui.tsx";
import Loader from "../../../../shared/components/loader/loader.tsx";
import {
    usePlaybackState,
    usePlayerDevice,
    useSpotifyPlayer,
    useWebPlaybackSDKReady
} from "react-spotify-web-playback-sdk";
import {useEffect, useRef, useState} from "react";
import type {PlayerProps} from "../../../../shared/interfaces/player-interface.ts";

const PlayerSdk = ({song, accessToken, gameType, resultWave, ready}: PlayerProps) => {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState(true);
    const device = usePlayerDevice();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const previousSongRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!song) return;

        const duration: number = song?.duration_ms ?? 0;

        if (playbackState) {
            const playing = !playbackState.paused;
            setIsPlaying(playing);
            setProgress(playbackState.position || 0);
            setDuration(playbackState.duration || duration);
        }
    }, [playbackState, song, gameType]);

    useEffect(() => {
        const loadAndPauseSong = async () => {
            if (!device || device.status !== "ready" || !player) return;
            if (!song) return;

            const isNewSong = previousSongRef.current !== song.id;
            previousSongRef.current = song.id;

            if (!isNewSong) return;

            try {
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uris: [`spotify:track:${song.id}`],
                        position_ms: 0
                    }),
                });
                setProgress(0);
                setDuration(song.duration_ms || 0);
                setIsPlaying(true);
            } catch (err) {
                console.error("Error for loading player : ", err);
            }
        };

        loadAndPauseSong();
    }, [device, song, accessToken, player]);

    useEffect(() => {
        if (gameType && !player) return;

        const handleReadyChange = async () => {
            if (ready) {
                try {
                    await player?.resume();
                } catch (err) {
                    console.error("Error for resuming player : ", err);
                }
            } else {
                try {
                    await player?.pause();
                } catch (err) {
                    console.error("Error for pausing player : ", err);
                }
            }
        }

        handleReadyChange();

    }, [ready, gameType, player]);

    const handleChangePosition = async (newPosition: number) => {
        try {
            setProgress(newPosition);
            await player.seek(newPosition);
        } catch (err) {
            console.error("Can't change the current position : ", err);
        }
    }

    const handlePlayPause = async () => {
        if (!player || !device || device.status !== "ready") {
            console.warn("Player or device not ready", {player: !!player, device, status: device?.status});
            return;
        }

        try {
            if (isPlaying) {
                await player.pause();
                setIsPlaying(false);
            } else {
                await player.resume();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Error for play/pause : ", err);
        }
    }

    const sdkReady = useWebPlaybackSDKReady();
    if (!sdkReady || !device) return <Loader/>;

    return (
        <PlayerUi
            accessToken={accessToken}
            song={song}
            progress={progress}
            duration={duration}
            isPlaying={isPlaying}
            gameType={gameType}
            resultWave={resultWave}
            ready={ready}
            changePosition={handleChangePosition}
            playPause={handlePlayPause}
        />
    );
};

export default PlayerSdk;
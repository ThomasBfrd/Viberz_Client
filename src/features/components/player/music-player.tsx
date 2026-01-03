import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    usePlaybackState,
    usePlayerDevice,
    useSpotifyPlayer,
    useWebPlaybackSDKReady,
    WebPlaybackSDK,
} from "react-spotify-web-playback-sdk";
import type {Artist, Track} from "../../../shared/interfaces/guess-song.interface.ts";
import "./music-player.scss";
import Loader from "../../../shared/components/loader/loader.tsx";
import clsx from "clsx";
import PlayIcon from "../../../shared/components/svg/play/play-icon.tsx";
import PauseIcon from "../../../shared/components/svg/pause/pause-icon.tsx";
import HeartIcon from "../../../shared/components/svg/heart/heart-icon.tsx";
import {useFetch} from "../../../shared/hooks/useFetch.tsx";

interface PlayerProps {
    song: Track | undefined;
    gameType?: string | null;
    resultWave?: boolean;
    accessToken?: string;
    ready?: boolean;
    onPlayingStateChange?: (state: boolean) => void;
}

const MusicPlayer = ({song, accessToken, gameType, resultWave, ready, onPlayingStateChange}: PlayerProps) => {
    const getOAuthToken = useCallback(
        (callback: (arg0: string) => Promise<unknown>) => callback(accessToken ?? ""),
        [accessToken]
    );

    return (
        <WebPlaybackSDK
            initialDeviceName="Viberz Player"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
            connectOnInitialized={true}
        >
            {gameType ? (
                <PlayerUI song={song} gameType={gameType} resultWave={resultWave} accessToken={accessToken}/>
            ) : (
                <PlayerUI song={song} accessToken={accessToken} ready={ready} onPlayingStateChange={onPlayingStateChange}/>
            )}
        </WebPlaybackSDK>
    );
};

const PlayerUI = ({song, accessToken, gameType, resultWave, ready, onPlayingStateChange}: PlayerProps) => {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState(true);
    const device = usePlayerDevice();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const {fetchData} = useFetch();
    const [likedSong, setLikedSong] = useState<boolean>(false);
    const progressRef = useRef<HTMLDivElement>(null);
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

    const handlePlayPause = async () => {

        if (!player || !device || device.status !== "ready") {
            console.warn("Player or device not ready", {player: !!player, device, status: device?.status});
            return;
        }

        if (onPlayingStateChange) {
            onPlayingStateChange(!isPlaying);
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
    };

    const displayTimecodes = useCallback(() => {
        if (!duration) return '00:00';
        const minutes = Math.floor(progress / 60000);
        const seconds = Math.floor((progress % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, [progress, duration]);

    const handleChangePosition = async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!player || !duration || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const fraction = Math.max(0, Math.min(1, offsetX / width));
        const newPosition = Math.round(fraction * duration);

        try {
            setProgress(newPosition);
            await player.seek(newPosition);
        } catch (err) {
            console.error("Can't change the current position : ", err);
        }
    };

    const onLikeSong = useCallback(async () => {
        if (!song?.id || !accessToken) return;

        const result = await fetchData('https://api.spotify.com/v1/me/tracks', {
            method: likedSong ? 'DELETE' : 'PUT',
            jwtToken: accessToken,
            body: {
                ids: [song?.id]
            }
        });

        if (result?.success) {
            setLikedSong(!likedSong);
        }
    }, [song?.id, accessToken, fetchData, likedSong]);

    const sdkReady = useWebPlaybackSDKReady();
    if (!sdkReady || !device) return <Loader/>;

    return (
        <div className="player-container" style={{
            width: gameType ? '320px' : '100%',
            background: gameType ?? `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6)), url(${song?.album.images[0]?.url || undefined})`,
            backdropFilter: gameType ?? "blur(8px)",
        }}>
            <div className="player-body">
                <div className="player-informations">
                    <div className="player-cover">
                        {(!ready && !song) && !gameType ? (
                            <div className="player-cover-music"></div>
                        ) : (
                            <img
                                src={song?.album.images[0]?.url || undefined}
                                alt={`${song?.name} cover`}
                                className={clsx(
                                    gameType === "guess-song" && !resultWave && "player-hidden-text",
                                    gameType === "guess-song" && resultWave && "player-reveal-text"
                                )}
                            />
                        )}
                    </div>
                    <div className="player-informations-text">
                        <div className="player-informations-text-artists">
                            <p className="player-artists">
                                {song?.artists.map((artist: Artist, index: number) => (
                                    <span key={index}
                                          className={clsx(
                                              gameType === "guess-song" && !resultWave && "player-hidden-text",
                                              gameType === "guess-song" && resultWave && "player-reveal-text"
                                          )}
                                    >
                                    {artist.name}{song?.artists.length - 1 !== index ? ', ' : ''}
                                </span>
                                ))}
                            </p>
                        </div>
                        <p className={clsx(
                            "player-song-text",
                            gameType === "guess-song" && !resultWave && "player-hidden-text",
                            gameType === "guess-song" && resultWave && "player-reveal-text"
                        )}>{song?.name}</p>
                    </div>
                </div>
                <div className="player-play">
                    <button className="player-play-button" onClick={handlePlayPause}>
                        {!isPlaying ? <PlayIcon/> : <PauseIcon/>}
                    </button>
                    {!gameType ? (
                        <button className="content-icon"
                             style={{backgroundColor: likedSong ? "#182725" : "#26AAA4FF"}}
                             onClick={onLikeSong}
                             data-testid="player-social-like">
                            <HeartIcon height={"20px"} width={"20px"} />
                        </button>
                    ) : null}
                </div>
            </div>
            <div
                className="player-progress-container"
            >
                <div className="player-progress-bar" ref={progressRef}
                     onClick={handleChangePosition}>
                    <div
                        className="player-progress-bar-active"
                        style={{width: `${duration ? (progress / duration) * 100 : 0}%`}}
                    />
                </div>
                <p className="player-time-text">
                    {displayTimecodes()}
                </p>
            </div>
        </div>
    );
};

export default MusicPlayer;
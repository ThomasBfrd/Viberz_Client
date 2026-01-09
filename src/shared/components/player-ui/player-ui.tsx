import React, {useCallback, useContext, useRef, useState} from 'react';
import './player-ui.scss';
import clsx from "clsx";
import type {Artist, Track} from "../../interfaces/guess-song.interface.ts";
import PlayIcon from "../svg/play/play-icon.tsx";
import PauseIcon from "../svg/pause/pause-icon.tsx";
import HeartIcon from "../svg/heart/heart-icon.tsx";
import {useFetch} from "../../hooks/useFetch.tsx";
import {AuthContext} from "../../../core/context/auth-context.tsx";

interface PlayerUiProps {
    accessToken?: string;
    song: Track | undefined;
    progress: number;
    duration: number;
    isPlaying: boolean;
    likedSong?: boolean;
    gameType?: string | null;
    resultWave?: boolean;
    ready?: boolean;
    changePosition: (newPosition: number) => void;
    playPause: () => void;
}

const PlayerUi = ({accessToken, song, progress, duration, isPlaying, gameType, resultWave, ready, changePosition, playPause}: PlayerUiProps) => {
    const {fetchData} = useFetch();
    const [likedSong, setLikedSong] = useState<boolean>(false);
    const progressRef = useRef<HTMLDivElement>(null);
    const {guest} = useContext(AuthContext);

    const displayTimecodes = useCallback(() => {
        if (!duration) return '00:00';
        const minutes = Math.floor(progress / 60000);
        const seconds = Math.floor((progress % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, [progress, duration]);

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

    const handleChangePosition = async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();

        if (!rect) return;

        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const fraction = Math.max(0, Math.min(1, offsetX / width));
        const newPosition = Math.round(fraction * duration);

        // Always delegate to parent handler (guest or not)
        changePosition(newPosition);
    };

    const handlePlayPause = async () => {
        // Always delegate to parent handler (guest or not)
        return playPause();
    };

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
                    {!gameType && !guest ? (
                        <button className="content-icon"
                                style={{backgroundColor: likedSong ? "#182725" : "#26AAA4FF"}}
                                onClick={onLikeSong}
                                data-testid="player-social-like">
                            <HeartIcon height={"20px"} width={"20px"} />
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="player-progress-container">
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

export default PlayerUi;
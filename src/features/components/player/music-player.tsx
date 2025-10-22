import {useState, useCallback, useEffect, useRef} from "react";
import {
    WebPlaybackSDK,
    useSpotifyPlayer,
    usePlaybackState,
    usePlayerDevice,
    useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import type {RandomSong, Artist} from "../../../shared/interfaces/guess-song.interface.ts";
import "./music-player.scss";
import Loader from "../../../shared/components/loader/loader.tsx";

interface PlayerProps {
    randomSong?: RandomSong | undefined;
    accessToken?: string;
}

const MusicPlayer = ({randomSong, accessToken}: PlayerProps) => {
    const getOAuthToken = useCallback(
        (callback: any) => callback(accessToken ?? ""),
        [accessToken]
    );

    if (!randomSong) return <Loader />;

    return (
        <WebPlaybackSDK
            initialDeviceName="Viberz Player"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
            connectOnInitialized={true}
        >
            <PlayerUI randomSong={randomSong} accessToken={accessToken}/>
        </WebPlaybackSDK>
    );
};

const PlayerUI = ({randomSong, accessToken}: PlayerProps) => {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState(true);
    const device = usePlayerDevice();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const progressRef = useRef<HTMLDivElement>(null);

    // Synchronise l'état local avec le playback réel (y compris progress et duration)
    useEffect(() => {
        if (playbackState) {
            setIsPlaying(!playbackState.paused);
            setProgress(playbackState.position || 0);
            setDuration(playbackState.duration || randomSong?.song.track.duration_ms || 0);
        }
    }, [playbackState, randomSong]);

    // Charge la nouvelle chanson et la met en pause quand randomSong change ou device ready
    useEffect(() => {
        const loadAndPauseSong = async () => {
            if (!device || device.status !== "ready" || !player) return;

            try {
                // Charge et lance la piste via API
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uris: [`spotify:track:${randomSong?.song.track.id}`],
                        position_ms: 0
                    }),
                });

                // Immédiatement pause pour éviter l'auto-play
                await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${device.device_id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                // Initialise la duration depuis les métadonnées de la track (disponible immédiatement)
                setDuration(randomSong?.song.track.duration_ms || 0);
                setProgress(0);

            } catch (err) {
                console.error("Error for loading player : ", err);
            }
        };

        loadAndPauseSong();

        return () => {

        }
    }, [device, randomSong, player, accessToken]);

    const handlePlayPause = async () => {
        if (!player) return;
        if (isPlaying) await player.pause();
        else await player.resume();
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

    // Optionnel : Afficher un loading si SDK pas prêt
    const sdkReady = useWebPlaybackSDKReady();
    if (!sdkReady || !device) return <Loader />;

    return (
        <div className="container">
            <div className="informations">
                <div className="cover">
                    <img
                        src={randomSong?.song.track.album.images[0]?.url || ''}
                        alt={`${randomSong?.song.track.name} cover`}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                </div>
                <div className="informations-text">
                    <div className="informations-text-artists">
                            <p className="artists">
                        {randomSong?.song.track.artists.map((artist: Artist, index: number) => (
                                <span key={index}>{artist.name}{randomSong?.song.track.artists.length - 1 !== index ? ', ' : ''}</span>
                        ))}
                            </p>
                    </div>
                    <p className="song-text">{randomSong?.song.track.name}</p>
                </div>
                <div className="play">
                    <button className="play-button" onClick={handlePlayPause}>
                        {!isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" width="40px" viewBox="0 0 512 512">
                                <path
                                    fill="#fff"
                                    d="M256,0C114.625,0,0,114.625,0,256c0,141.374,114.625,256,256,256c141.374,0,256-114.626,256-256
                            C512,114.625,397.374,0,256,0z M351.062,258.898l-144,85.945c-1.031,0.626-2.344,0.657-3.406,0.031
                            c-1.031-0.594-1.687-1.702-1.687-2.937v-85.946v-85.946c0-1.218,0.656-2.343,1.687-2.938c1.062-0.609,2.375-0.578,3.406,0.031
                            l144,85.962c1.031,0.586,1.641,1.718,1.641,2.89C352.703,257.187,352.094,258.297,351.062,258.898z"
                                />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16"
                                 fill="none">
                                <path d="M7 1H2V15H7V1Z" fill="#fff"/>
                                <path d="M14 1H9V15H14V1Z" fill="#fff"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <div
                className="progress-container"
            >
                <div className="progress-bar" ref={progressRef}
                     onClick={handleChangePosition}>
                    <div
                        className="progress-bar-active"
                        style={{width: `${duration ? (progress / duration) * 100 : 0}%`}}
                    />
                </div>
                <p className="time-text">
                    {displayTimecodes()}
                </p>
            </div>
        </div>
    );
};

export default MusicPlayer;
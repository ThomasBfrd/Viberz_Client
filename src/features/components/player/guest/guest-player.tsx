import {useEffect, useRef, useState} from "react";
import PlayerUi from "../../../../shared/components/player-ui/player-ui.tsx";
import type {PlayerProps} from "../../../../shared/interfaces/player-interface.ts";

const GuestAudioPlayer = ({song, gameType, resultWave, ready}: PlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const prevSongIdRef = useRef<string | undefined>(undefined);

    const previewUrl =  `https://res.cloudinary.com/de7kgkvgt/video/upload/${song?.id}.mp3`

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => setProgress(Math.floor(audio.currentTime * 1000));
        const onLoadedMetadata = () => setDuration(Math.floor((audio.duration || 0) * 1000));
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !song) return;

        const isNew = prevSongIdRef.current !== song.id;
        prevSongIdRef.current = song.id;

        if (!isNew) return;

        try {
            setIsPlaying(false);
            setProgress(0);
            setDuration(song.duration_ms || 0);

            if (previewUrl) {
                audio.src = previewUrl;
                audio.load();
                if (ready) {
                    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
                }
            } else {
                audio.removeAttribute('src');
                audio.load();
            }
        } catch (e) {
            console.error('GuestAudioPlayer load error:', e);
        }
    }, [song, ready, previewUrl]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (ready) {
            audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    }, [ready]);

    const handleChangePosition = async (newPosition: number) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        try {
            const sec = newPosition / 1000;
            audio.currentTime = sec;
            setProgress(newPosition);
        } catch (e) {
            console.error('GuestAudioPlayer seek error:', e);
        }
    };

    const handlePlayPause = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (e) {
            console.error('GuestAudioPlayer play/pause error:', e);
        }
    };

    return (
        <>
            <audio ref={audioRef} className="player-audio-guest" />
            <PlayerUi
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
        </>
    );
};

export default GuestAudioPlayer;
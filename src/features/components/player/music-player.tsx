import {useContext} from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import "./music-player.scss";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import PlayerSdk from "./sdk/sdk-player.tsx";
import GuestAudioPlayer from "./guest/guest-player.tsx";
import type {PlayerProps} from "../../../shared/interfaces/player-interface.ts";

const MusicPlayer = ({song, accessToken, gameType, resultWave, ready, onPlayingStateChange}: PlayerProps) => {
    const {guest} = useContext(AuthContext);

    // Guest mode: use HTMLAudioElement instead of Spotify SDK
    if (guest) {
        return (
            <GuestAudioPlayer
                song={song}
                gameType={gameType}
                resultWave={resultWave}
                ready={ready}
            />
        );
    }

    const getOAuthToken = (callback: (arg0: string) => Promise<unknown>) => callback(accessToken ?? "");

    return (
        <WebPlaybackSDK
            initialDeviceName="Viberz Player"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
            connectOnInitialized={true}
        >
            {gameType ? (
                <PlayerSdk song={song} gameType={gameType} resultWave={resultWave} accessToken={accessToken}/>
            ) : (
                <PlayerSdk song={song} accessToken={accessToken} ready={ready} onPlayingStateChange={onPlayingStateChange}/>
            )}
        </WebPlaybackSDK>
    );
};

export default MusicPlayer;
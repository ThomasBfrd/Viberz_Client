import type {Playlist} from "../../../../shared/interfaces/playlist.interface.ts";
import {useContext, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import {type FetchResult, useFetch} from "../../../../shared/hooks/useFetch.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Song, Track} from "../../../../shared/interfaces/guess-song.interface.ts";
import type {PaginatedData} from "../../../../shared/interfaces/paginated-data.interface.ts";
import "./playlist-page.scss";
import TrackListItem from "../../../../shared/components/track-list-item/track-list-item.tsx";
import MusicPlayer from "../../../components/player/music-player.tsx";
import PlayIcon from "../../../../shared/components/svg/play/play-icon.tsx";
import HeartIcon from "../../../../shared/components/svg/heart/heart-icon.tsx";
import ShareIcon from "../../../../shared/components/svg/share/share-icon.tsx";
import PauseIcon from "../../../../shared/components/svg/pause/pause-icon.tsx";
import playlistsService from "../../../../shared/services/playlists.service.ts";
import Loader from "../../../../shared/components/loader/loader.tsx";
import ModalOverlay from "../../../../shared/components/modal-overlay/modal-overlay.tsx";
import AddPlaylistForm from "../add-playlist-form/add-playlist-form.tsx";
import EditIcon from "../../../../shared/components/svg/edit/edit-icon.tsx";
import ProfilePicture from "../../../../shared/components/profile-picture/profile-picture.tsx";
import {base64ToImage} from "../../../../shared/utils/base64-images.ts";
import BackButton from "../../../../shared/components/back-button/back-button.tsx";
import DeleteIcon from "../../../../shared/components/svg/delete/delete-icon.tsx";
import EventAction from "../../../../shared/components/event-action/event-action.tsx";
import {Tooltip} from "react-tooltip";

interface PlayerState {
    song: Track | undefined;
    isPlaying: boolean;
}

const PlaylistPage = () => {
    const {jwtToken, userId, guest} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const {playlistId} = useParams<{playlistId: string}>();
    const queryClient = useQueryClient();
    const {fetchData} = useFetch<PaginatedData<Playlist> | undefined>();
    const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
    const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState<boolean>(false);
    const [playerState, setPlayerState] = useState<PlayerState>({
        song: undefined,
        isPlaying: false,
    });
    const [shareNotification, setShareNotification] = useState<boolean>(false);
    const {data, isLoading, error} = useQuery({
        queryKey: ["playlist", playlistId],
        queryFn: async () => {
            if (!jwtToken) throw new Error('No token provided');

            const result: FetchResult<PaginatedData<Playlist> | undefined> = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/playlist?playlistId=${playlistId}`, {
                method: 'GET',
                jwtToken: jwtToken
            });

            if (!result?.data?.items?.[0]) {
                throw new Error("Playlist not found");
            }

            return {
                playlist: result.data.items[0],
                accessToken: result?.data.accessToken
            }
        },
        enabled: !!jwtToken && !!playlistId
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!jwtToken) throw new Error('No token provided');
            const result = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/playlist?playlistId=${playlistId}`, {
                method: 'DELETE',
                jwtToken: jwtToken
            });

            return result.data;
        },
        onSuccess: () => {
            return navigate("/discover");
        },
        onError: (error) => {
            console.error("Can't delete this playlist, please try later. ", error);
        }
    })

    const updateMutation = useMutation({
        mutationFn: async () => {
            if (!jwtToken) throw new Error('No token provided');
            const result = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/playlist?playlistId=${playlistId}`, {
                method: 'GET',
                jwtToken: jwtToken
            });

            return result.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["playlist", playlistId], {
                playlist: data?.items[0],
                accessToken: data?.accessToken
            })
        },
        onError: (error) => {
            console.error("Can't update this playlist, please try later. ", error);
        }
    });

    const likeMutation = useMutation({
        mutationFn: async () => {
            if (!jwtToken) throw new Error('No token provided');
            if (!playlistId) return;
            return playlistsService.likePlaylist(playlistId, jwtToken);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["playlist", playlistId] });

            const previousData = queryClient.getQueryData(["playlist", playlistId]);

            queryClient.setQueryData(["playlist", playlistId], (old: { playlist: Playlist; accessToken: string } | undefined
            ) => {
                if (!old?.playlist) return old;
                return {
                    ...old,
                    playlist: {
                        ...old.playlist,
                        likedByUser: !old.playlist.likedByUser,
                        likes: old.playlist.likedByUser
                            ? old.playlist.likes - 1
                            : old.playlist.likes + 1
                    }
                };
            });

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["playlist", variables],
                    context.previousData
                );
            }
            console.error("Error liking playlist:", err);
        }
    });

    const playlist: Playlist = data?.playlist as Playlist;
    const userImageProfile: string = base64ToImage(playlist?.userImageProfile) ?? "";
    const playlistOwner: string = data?.playlist.userId ?? "";
    const tracks: Song[] = playlist?.songs.tracks.items ?? [];

    const handleTrackClick = (song: Track) => {
        if (playerState.song?.id === song.id) {
            setPlayerState((prevState) => ({...prevState, isPlaying: !prevState.isPlaying}));
        } else {
            setPlayerState({song, isPlaying: true});
        }
    }

    const handlePlayPause = () => {
        const songToPlay: Track = playerState.song ?? tracks[0].track;
        if (!songToPlay) return;

        if (playerState.song?.id === songToPlay?.id) {
            setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        } else {
            setPlayerState({ song: songToPlay, isPlaying: true });
        }
    };

    const handlePlayerStateChange = (isPlaying: boolean) => {
        setPlayerState(prev => ({ ...prev, isPlaying }));
    };

    const handleLike = () => {
        if (!playlist?.id) return;
        likeMutation.mutate();
    };

    const onConfirmDeletePlaylist = () => {
        setConfirmDeleteModal(true);
    }

    const handleDeletePlaylist = () => {
        if (!playlist?.id) return;
        deleteMutation.mutate();
    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${location.pathname}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareNotification(true);
            setTimeout(() => setShareNotification(false), 3000);
        } catch (error) {
            console.error("Erreur lors de la copie:", error);
        }
    };

    const handleCloseAddPlaylistModal = () => {
        if (playlist?.id) {
            updateMutation.mutate();
        }

        setOpenAddPlaylistModal(!openAddPlaylistModal);
    }

    if (error || (!isLoading && !playlist)) {
        return (
            <div className="page-transition playlist-container">
                <p>An error has occurred or playlist not found</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="page-transition playlist-container">
                <Loader />
            </div>
        );
    }

    return (
        <div className="page-transition playlist-container" data-testid="playlist-page-container">
            {openAddPlaylistModal &&
                <ModalOverlay
                    isClosable={true}
                    children={<AddPlaylistForm
                        updating={true}
                        closeModal={handleCloseAddPlaylistModal}
                        name={playlist.name}
                        spotifyPlaylistId={playlist.spotifyPlaylistId}
                        id={playlist.id}
                        genreList={playlist.genreList} />}
                    closed={handleCloseAddPlaylistModal} />
            }
            {confirmDeleteModal &&
                <ModalOverlay
                    isClosable={false}
                    children={<EventAction
                        eventType={"warning"}
                        message={`Are you sure you want to delete this playlist?`}
                        handleClose={() => setConfirmDeleteModal(false)}
                        handleSubmit={handleDeletePlaylist} />} />
            }
            <div className="playlist-content">
                <BackButton disabled={isLoading} />
                {playlistOwner === userId && (
                    <div className="playlist-header-owner-actions">
                        <button className="button-edit" aria-label="Edit playlist" onClick={handleCloseAddPlaylistModal} data-testid="playlist-edit-button">
                            <EditIcon height={"15px"} width={"15px"} />
                        </button>
                        <button
                            className="playlist-header-delete-button"
                            aria-label="Delete playlist"
                            onClick={onConfirmDeletePlaylist}
                            data-testid="playlist-delete-button">
                            <DeleteIcon height={"15px"} width={"15px"} />
                        </button>
                    </div>
                )}
                <div className="playlist-header">
                    <img
                        src={playlist.imageUrl}
                        alt={`${playlist.name} cover`}
                        className="playlist-header-cover"
                    />
                    <div className="playlist-header-name-container" data-testid="playlist-header-name-container">
                        <div
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={playlist.name}
                            data-tooltip-place="top"
                            className="playlist-header-title">
                            <Tooltip id="my-tooltip" className="example"/>
                            <p>{playlist.name}</p>
                        </div>
                    </div>
                    <div className="playlist-header-genres-user">
                        <span className="playlist-header-genre">{playlist.genreList.join(", ")}</span>
                        <span className="playlist-header-separator">|</span>
                        <div className="playlist-header-user">
                            <div className="user-image">
                                <ProfilePicture image={userImageProfile} />
                            </div>
                            <p className="playlist-header-created">{playlist.userName}</p>
                        </div>
                    </div>
                </div>
                {!guest && (
                    <div className="playlist-actions">
                        <button
                            className="playlist-social"
                            onClick={handleLike}
                            disabled={likeMutation.isPending}
                            data-testid="playlist-social-like"
                            aria-label={playlist.likedByUser ? "Unlike playlist" : "Like playlist"}
                        >
                            <div
                                className="content-icon"
                                style={{ backgroundColor: playlist.likedByUser ? "#182725" : "#26AAA4FF" }}
                            >
                                <HeartIcon height="15px" width="15px" />
                            </div>
                            <div className="playlist-social-text">
                                <span>{playlist.likes}</span>
                            </div>
                        </button>

                        <button
                            className="playlist-social-play-button"
                            onClick={handlePlayPause}
                            disabled={tracks.length === 0}
                            aria-label={playerState.isPlaying ? "Pause" : "Play"}
                        >
                            {playerState.isPlaying ? (
                                <PauseIcon height="20px" width="20px" />
                            ) : (
                                <PlayIcon height="20px" width="20px" circle={false} />
                            )}
                        </button>

                        <button
                            className="playlist-social share"
                            onClick={handleShare}
                            data-testid="playlist-social-share"
                            aria-label="Share playlist"
                        >
                            {shareNotification && (
                                <div className="shared">
                                    <p>Playlist copied to clipboard!</p>
                                </div>
                            )}
                            <div className="content-icon">
                                <ShareIcon height="15px" width="15px" />
                            </div>
                            <div className="playlist-social-text">
                                <span>Share</span>
                            </div>
                        </button>
                    </div>
                )}
                <div className="playlist-body">
                    {tracks.length === 0 ? (
                        <p>No tracks in this playlist</p>
                    ) : (
                        tracks && tracks.map((song: Song, index: number) => (
                            <TrackListItem<Track>
                                key={song.track.id}
                                item={song.track}
                                index={index}
                                title={song.track.name}
                                subtitle={song.track.artists.map(artist => artist.name).join(", ")}
                                cover={song.track.album.images[0]?.url}
                                isListening={
                                    playerState
                                }
                                itemClicked={handleTrackClick}
                            />
                        ))
                    )}
                </div>

                <div className="playlist-footer">
                {guest ? (
                    <div className="playlist-footer-guest">
                        <p>Users must log in before listening these tracks.</p>
                    </div>
                ) : (
                    <MusicPlayer
                        accessToken={data?.accessToken}
                        song={playerState?.song}
                        ready={playerState.isPlaying}
                        onPlayingStateChange={handlePlayerStateChange}
                    />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlaylistPage;
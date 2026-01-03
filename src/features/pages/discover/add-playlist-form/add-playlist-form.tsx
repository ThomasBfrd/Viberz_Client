import "./add-playlist-label.scss";
import {useState, type FormEvent, useContext, useRef} from "react";
import {FAMILY_GENRES} from "../../../../shared/const/family-genres.ts";
import {type FetchResult, useFetch} from "../../../../shared/hooks/useFetch.tsx";
import {useMutation} from "@tanstack/react-query";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import Loader from "../../../../shared/components/loader/loader.tsx";
import type {Playlist} from "../../../../shared/interfaces/playlist.interface.ts";
import type {FamilyGenres} from "../../../../shared/interfaces/family-genres.interface.ts";

interface AddPlaylistFormProps {
    updating: boolean;
    name?: string;
    genreList?: string[];
    spotifyPlaylistId?: string;
    id?: number;
    closeModal: (playlist: Playlist | undefined) => void;
}

export interface PlaylistFormData {
    name: string;
    genreList: string[];
    spotifyPlaylistId: string;
    id?: number;
}

const AddPlaylistForm = ({updating = false, name, genreList, spotifyPlaylistId, id, closeModal}: AddPlaylistFormProps) => {
    const formInitialValues: PlaylistFormData = {
        name: name ?? "",
        genreList: genreList ?? [],
        spotifyPlaylistId: spotifyPlaylistId ?? "",
        id: id ?? undefined
    }
    const [formData, setFormData] = useState<PlaylistFormData>(formInitialValues);
    const {jwtToken} = useContext(AuthContext);
    const {fetchData} = useFetch();
    const formRef = useRef<HTMLFormElement>(null);

    const createPlaylist = useMutation({
        mutationFn: async (data: PlaylistFormData) => {

            if (!jwtToken) throw new Error("No token provided");

            const requestBody = updating ? {...data, id: id} : {...data};

            const response: FetchResult<PlaylistFormData | unknown> = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/playlist`, {
                method: updating ? "PUT" : "POST",
                body: JSON.stringify(requestBody),
                jwtToken: jwtToken
            });

            return response.data;
        },
        onSuccess: (responseData) => {
            setFormData(formInitialValues);

            if (!updating) {
                closeModal(responseData as Playlist);
            } else {
                closeModal(undefined);
            }

        },
        onError: (error: unknown) => {
            console.error("Error to add this playlist : ", error);
        }
    });

    const handleNameChange = (name: string) => {
        const nameRegex = /^[a-zA-Z0-9-_ ]*$/;

        if (name.length > 0 && nameRegex.test(name)) {
            return setFormData(prev => ({...prev, name: name}));
        }
    }

    const handlePlaylistLinkChange = (link: string) => {

        if (link.includes("spotify.com/playlist/")) {
            const playlistId = link.split("/playlist/")[1].split("?")[0];
            setFormData(prev => ({...prev, spotifyPlaylistId: playlistId}));
        } else {
            setFormData(prev => ({...prev, spotifyPlaylistId: ""}));
        }
    }

    const handleGenreToggle = (genre: string) => {
        setFormData((prev: PlaylistFormData) => {
                const isSelected: boolean = prev.genreList.includes(genre);

                if (isSelected) {
                    return {...prev, genreList: prev.genreList.filter(g => g !== genre)};

                } else if (prev.genreList.length < 2) {
                    return {...prev, genreList: [...prev.genreList, genre]};

                }

                return prev;
        })
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            console.error("The playlist name is required");
        }

        if (!formData.spotifyPlaylistId) {
            console.error("The Spotify playlist link is required");
        }

        if (formData.genreList.length < 1) {
            console.error("You must select at least one category");
        }

        await createPlaylist.mutateAsync(formData);
    }

    const isFormValid = formData.name.trim() && formData.spotifyPlaylistId && formData.genreList.length > 0;

    return (
        <div className="add-playlist-form container">
            <div className="add-playlist-form-content">
                {createPlaylist.isPending && <Loader />}
                <div className="add-playlist-form-header">
                    <h1>Add a playlist</h1>
                </div>
                <form className="add-playlist-form-body" onSubmit={handleSubmit} ref={formRef}>
                    <label className="add-playlist-label">Choose a name for your playlist</label>
                    <input
                        className="add-playlist-input"
                        type="text"
                        value={formData.name}
                        placeholder="My playlist name"
                        required
                        onChange={(e) => handleNameChange(e.target.value)}/>

                    <label className="add-playlist-label">Paste your playlist link here</label>
                    <input
                        className="add-playlist-input"
                        type="text"
                        value={formData.spotifyPlaylistId}
                        disabled={updating}
                        placeholder="https://open.spotify.com/playlist/...."
                        required
                        onChange={(e) => handlePlaylistLinkChange(e.target.value)}/>

                    <label className="add-playlist-label">Select family genres (max 2)</label>
                    <div className="add-playlist-genre-list">
                        {FAMILY_GENRES.filter((genre: FamilyGenres) => genre.path !== "all" && genre.path !== "my-playlists").map((genre: FamilyGenres, index: number) => (
                            <div
                                className="add-playlist-genre-item"
                                style={{backgroundColor: formData.genreList.includes(genre.label) ? "#182725FF" : "#26AAA4FF"}}
                                key={index}
                                aria-pressed={formData.genreList.includes(genre.label)}
                                onClick={() => handleGenreToggle(genre.label)}>
                                {genre.label}
                            </div>
                        ))}
                    </div>
                    <div className="add-playlist-form-footer">
                        <button
                            type="submit"
                            disabled={!isFormValid || createPlaylist.isPending}
                            className="add-playlist-button">{id ? "Update" : "Add playlist"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPlaylistForm;
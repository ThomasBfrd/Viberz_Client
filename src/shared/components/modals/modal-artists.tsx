import './modal-artists.scss';
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import artistService from "../../services/artist.service.ts";
import Loader from "../loader/loader.tsx";

export interface ModalSearchArtistsProps {
    addSearchedArtist: (artist: string[]) => void;
    toggleModal: (value: boolean) => void;
    artistsSelected: string[];
}

export interface ImageProfile {
    height: number;
    url: string | undefined;
    width: number;
}

export interface ArtistSearchResponse {
    genres: string[];
    name: string;
    id: string;
    images: ImageProfile[];
}

const ModalSearchArtists = ({addSearchedArtist, toggleModal, artistsSelected}: ModalSearchArtistsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [artists, setArtists] = useState<ArtistSearchResponse[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<string[]>(artistsSelected.length > 0 ? artistsSelected : []);
    const [errorMessage, setErrorMessage] = useState('');
    const timerId = useRef(0);
    const {jwtToken} = useContext(AuthContext);

    const handleSearch = async (e: any) => {
        e.preventDefault();
        const searchItem = e.target.value;
        const delay = 1500;
        clearTimeout(timerId.current);
        setIsLoading(true);
        timerId.current = setTimeout(() => {
            if (searchItem.length < 3 && searchItem.length > 0) {
                setErrorMessage('3 characters min');
            }
            console.log(searchItem)
            searchArtist(searchItem);
        }, delay);
    }

    useEffect(() => {

        return () => {
        }
    }, [isLoading])

    async function searchArtist(search: string) {
        if (jwtToken) {
            try {
                const result = await artistService.getSearchedArtists(jwtToken, search);
                if (result !== undefined) {
                    setArtists(result);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    function handleAddArtist(artist: ArtistSearchResponse) {
        if (selectedArtist.length < 3 && !selectedArtist.includes(artist.name)) {
            return setSelectedArtist([...selectedArtist, artist.name]);
        }

        return;
    }

    function handleDeleteArtist(artist: string) {
        if (selectedArtist.length > 0) {
            console.log(artist)
            const newSelectedArtist = selectedArtist.filter(artistSelected => artistSelected !== artist);
            setSelectedArtist(newSelectedArtist);
        }
    }

    function handleCloseModal(): void {
        addSearchedArtist(selectedArtist);
        return handleCancel();
    }

    function handleCancel(): void {
        toggleModal(false);
    }

    return (
        <div className="modal-container">
            <div className="modal-card">
                <button className="close-modal" onClick={handleCancel}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                        <path
                            d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                    </svg>
                </button>
                <p className="search-label">Search Artist</p>
                <input className="input-search" type="name" onChange={handleSearch}></input>
                <p className="input-error-message">{errorMessage}</p>
                <div className="result-search-container">
                    {isLoading ? (
                        <Loader/>
                    ) : null}
                    {!isLoading && artists.length > 0 ? (
                        artists.map((artist, index) => (
                            <div className="result-search-item" key={index} onClick={() => handleAddArtist(artist)}>
                                <div className="result-search-item-infos">
                                    {artist.images.length > 0 ? (
                                        <img
                                            src={artist.images[2].url}
                                            alt="user-image"
                                            className="image"
                                        />
                                    ) : null}
                                    <div className="result-search-item-infos-text-container">
                                        <div>
                                            <p className="result-search-item-infos-text">{artist.name}</p>
                                        </div>
                                        {artist.genres.length > 0 ? (
                                            <div className="genres">
                                                {artist.genres.slice(0, 2).map((genre, index) => (
                                                    <p className="genre-text" key={index}>{genre}</p>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : null}
                </div>
            </div>
            {selectedArtist.length > 0 ? (
                <div className="modal-card">
                    <p className="added-artist-title">Selected artists</p>
                    <div className="added-artist-container">
                        {selectedArtist.map((artistSelected, index) => (
                            <div key={index} className="added-artist-card">
                                <svg className="delete-artist-icon" onClick={() => handleDeleteArtist(artistSelected)}
                                     xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                                    <path
                                        d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                                </svg>
                                <p className="added-artist-text">{artistSelected}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <button className="send-button" onClick={handleCloseModal}>
                <p>Save</p>
            </button>
        </div>
    );
};

export default ModalSearchArtists;
import './edit-profile-page.scss';
import {type ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import type {UserInfos} from "../../../shared/interfaces/user.interface.ts";
import type {UpdateUser} from '../../../shared/interfaces/update-user.interface.ts';
import userService from "../../../shared/services/user.service.ts";
import genresService from "../../../shared/services/genres.service.ts";
import {useLocation, useNavigate} from 'react-router-dom';
import ModalSearchArtists from "../../../shared/components/modal-search-artists/modal-artists.tsx";
import ProfilePicture from "../../../shared/components/profile-picture/profile-picture.tsx";
import EditIcon from "../../../assets/svg/edit-icon/edit-icon.tsx";
import ExpandableList from "../../../shared/components/expandable-list/expandable-list.tsx";
import {emailRegex, userNameRegex} from "../../../shared/const/input-regex.ts";
import Loader from "../../../shared/components/loader/loader.tsx";
import EventModal from "../../../shared/components/event-modal/event-modal.tsx";

export default function EditProfileComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [userInfos, setUserInfos] = useState<UserInfos | undefined>(undefined);
    const [modalIsOpened, setModalIsOpened] = useState<boolean>(false);
    const [genres, setGenres] = useState<string[] | undefined>(undefined);
    const [genresSelected, setGenresSelected] = useState<string[]>([]);
    const [artists, setArtists] = useState<string[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [errorUserName, setErrorUserName] = useState<string | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);
    const [displayGenresList, setDisplayGenresList] = useState<boolean>(true);
    const [errorUpdate, setErrorUpdate] = useState<boolean>(false);
    const [errorNoUserName, setErrorNoUserName] = useState<boolean>(false);
    const {jwtToken} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        const locationState: UserInfos = location.state.userInfos;
        setImage(locationState?.user?.image ?? "");
        setUserName(locationState?.user?.userName ?? null);
        setEmail(locationState?.user?.email ?? "");
        setGenresSelected(locationState?.user.favoriteGenres);
        setArtists(locationState?.user.favoriteArtists);

        if (locationState?.user.favoriteGenres.length > 0) {
            setDisplayGenresList(false);
        }

    }, [location]);

    useEffect(() => {
        if (jwtToken && !genres) {
            const getGenres = async () => {
                try {
                    const fetchGenres = await genresService.getGenres(jwtToken);
                    setGenres(fetchGenres);
                } catch (error) {
                    console.error(error)
                }
            }
            getGenres();
        }

        return () => {
        };
    }, [genres, jwtToken]);

    function handleAddArtist(artists: string[]): void {
        setArtists(artists);
    }

    function handleCloseModal() {
        setModalIsOpened(!modalIsOpened);
    }

    function handleSelectGenre(genre: string) {
        if (genresSelected.length > 0 && genresSelected.includes(genre)) {
            return setGenresSelected([...genresSelected.filter((genreItem) => genreItem !== genre)])
        }

        if (genresSelected.length < 3 && !genresSelected.includes(genre)) {
            return setGenresSelected([...genresSelected, genre]);
        }
    }

    const submitForm = useCallback(async () => {
        setIsLoading(false);

        if (!userName || userName.length === 0) {
            setErrorUserName("Username is required");
            return;
        }

        const updateUserPayload: UpdateUser = {
            image: image.split(',')[1] ?? image,
            email: email,
            userName: userName,
            favoriteArtists: artists,
            favoriteGenres: genresSelected
        }

        const currentImage = userInfos?.user.image?.split(',')[1] ?? userInfos?.user.image;

        if (updateUserPayload && userInfos &&
            updateUserPayload.image === currentImage &&
            updateUserPayload.email === userInfos?.user.email &&
            updateUserPayload.userName === userInfos?.user.userName &&
            updateUserPayload.favoriteArtists === userInfos?.user.favoriteArtists &&
            updateUserPayload.favoriteGenres === userInfos?.user.favoriteGenres) {

            return navigate("/profile");
        }

        if (jwtToken && updateUserPayload) {
            try {
                setIsLoading(true);
                const updateResult: UserInfos | null = await userService.updateUserInfos(jwtToken, updateUserPayload);
                if (updateResult !== null) {
                    setUserInfos(updateResult);
                }

                return goToProfilePage();
            }
            catch (error: unknown) {
                console.error(error);
                return setErrorUpdate(true);
            }
            finally {
                setIsLoading(false);
            }
        }

    }, [artists, email, genresSelected, image, jwtToken, navigate, userInfos, userName]);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (!validExtensions.includes(file.type)) {
            console.error("Only jpg, JPEG and png are authorized!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImage(base64String);
        };
        reader.readAsDataURL(file);
    }

    function handleToggleSelectGenre(): void {
        setDisplayGenresList(!displayGenresList);
    }

    const goToProfilePage = useCallback(() => {
        if (!userName || userName.length === 0 || userInfos?.user?.userName.length === 0) {
            setErrorNoUserName(true);
        } else {
            navigate("/profile");
        }
    }, [navigate, userInfos, userName]);

    function onChangeUsername(e: ChangeEvent<HTMLInputElement>) {
        const username: string = e.target.value;
        setUserName(username);
        setErrorNoUserName(false);


        if (username === null || username?.length === 0) {
            return setErrorUserName("Username is required");
        } else if (username?.length < 3 || username?.length > 15) {
            return setErrorUserName("Username must be between 3 and 15 characters");
        } else if (!userNameRegex.test(username)) {
            return setErrorUserName("Username is not valid");
        } else {
            setErrorUserName(null);
            return;
        }
    }

    function onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
        const email = e.target.value;
        setEmail(email);
        if (email === null || email?.length === 0) {
            setErrorEmail("Email is required");
            return;
        } else if (!emailRegex.test(email)) {
            setErrorEmail("Email is not valid");
            return;
        } else {
            setErrorEmail(null);
            return;
        }
    }

    return (
        <div className="edit-profile-container" data-testid="edit-profile-container">
            {isLoading ? (<div className="loading-edit-profile"><Loader /></div>) : null}
            {errorUpdate || errorNoUserName ? (
                <EventModal
                    eventType="error"
                    message={errorUpdate ? "Cannot update your profile, please try again" : "You have to set a username."}
                    data-testid="edit-profile-error-modal"
                    handleClose={() => errorUpdate ? setErrorUpdate(!errorUpdate) : setErrorNoUserName(!errorNoUserName)} />
            ) : null}
            {modalIsOpened ? (
                    <ModalSearchArtists
                        addSearchedArtist={handleAddArtist}
                        toggleModal={handleCloseModal}
                        artistsSelected={artists}>
                    </ModalSearchArtists>
                ) : null
            }
            <div className="edit-profile-content" data-testid="edit-profile-error-form">
                <div className="buttons-navigation" data-testid="edit-profile-buttons-navigation">
                    <button
                        className="action-button back"
                        data-testid="edit-profile-button-back"
                        onClick={goToProfilePage} disabled={isLoading}>
                        <span className="action-button-text">Back</span>
                    </button>
                </div>
                <div className="profile-image">
                    {image && (
                        <ProfilePicture
                            image={image}
                            width={100}
                            height={100} />
                    )}
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/png, image/jpeg"
                        style={{ display: "none" }}
                        data-testid="edit-profile-edit-image-input"
                        onChange={handleFileChange}
                    />

                    <label htmlFor="fileInput" className="edit-button">
                        <EditIcon />
                    </label>

                </div>
                <div className="input-container" data-testid="edit-profile-inputs-container">
                    <input
                        className="form-input"
                        id="username"
                        placeholder="Username"
                        data-testid="edit-profile-input-username"
                        value={userName ?? ""}
                        onChange={onChangeUsername}/>
                    {errorUserName ? (
                        <p className="error-input" data-testid="edit-profile-error-text-username">{errorUserName}</p>
                    ) : null}
                    <input
                        className="form-input"
                        id="emailAddress"
                        placeholder="Email"
                        data-testid="edit-profile-input-email"
                        value={email ?? ""}
                        onChange={onChangeEmail}/>
                    {errorEmail ? (
                        <p className="error-input" data-testid="edit-profile-error-text-email">{errorEmail}</p>
                    ) : null}
                </div>
                <ExpandableList
                    title="Favorite genres"
                    subTitle="(Max. 3)"
                    displayButton={!(genresSelected.length === 0)}
                    forceIcon={!displayGenresList && genresSelected.length > 0}
                    toggleExpand={handleToggleSelectGenre} />
                <div className="favorites-container" data-testid="edit-profile-favorites-container">
                    {genresSelected.length === 0 || displayGenresList ? (
                        genres?.map((genre: string, index: number) => (
                            <div key={index}
                                 className={genresSelected.includes(genre) ?
                                     "favorites-selected-card" : "favorites-card"}
                                 data-testid="edit-profile-select-genre"
                                 onClick={() => handleSelectGenre(genre)}>
                                <p
                                    className={genresSelected.includes(genre) ?
                                        "favorite-selected-genres-text" :
                                        "favorite-genres-text"}
                                    data-testid="edit-profile-selected-genre-text">
                                    {genre}
                                </p>
                            </div>
                        ))
                    ) : genresSelected?.map((genre: string, index: number) => (
                            <div key={index} className="favorites-selected-card" data-testid="edit-profile-select-genre">
                                <p
                                    className="favorite-selected-genres-text"
                                    data-testid="edit-profile-selected-genre-text">{genre}</p>
                            </div>
                        )
                    )}
                </div>
                <ExpandableList
                    title="Favorite artists"
                    subTitle="(Max. 3)"
                    displayButton={true}
                    toggleExpand={() => setModalIsOpened(!modalIsOpened)}
                    forceIcon={true}/>
                {artists.length === 0 ? (
                        <div>
                            <p className="form-message" data-testid="edit-profile-no-artists">No artists selected</p>
                        </div>
                    ) :
                    (<div className="favorites-container" data-testid="edit-profile-favorites-artists-container">
                        {artists.map((artist, index) => (
                            <div className="favorites-selected-card" key={index}>
                                <p
                                    className="favorite-selected-genres-text"
                                    data-testid="edit-profile-selected-artist-text"
                                    key={index}>{artist}</p>
                            </div>
                        ))}
                    </div>)
                }
                <button
                    className={isLoading || errorEmail || errorUserName ? "action-button next disabled" :
                        "action-button next"}
                    data-testid="edit-profile-button-save"
                    onClick={submitForm} disabled={isLoading || errorEmail !== null || errorUserName !== null}>
                    <span className="action-button-text">Save</span>
                </button>
            </div>
        </div>
    )
}
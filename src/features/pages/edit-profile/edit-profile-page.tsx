import './edit-profile-page.scss';
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import type {UserInfos} from "../../../shared/interfaces/user.interface.ts";
import type {UpdateUser} from '../../../shared/interfaces/update-user.interface.ts';
import userService from "../../../shared/services/user-service.ts";
import genresService from "../../../shared/services/genres.service.ts";
import {useLocation, useNavigate} from 'react-router-dom';
import ModalSearchArtists from "../../../shared/components/modals/modal-artists.tsx";
import ProfilePicture from "../../../shared/components/profile-picture/profile-picture.tsx";
import EditIcon from "../../../assets/svg/edit-icon/edit-icon.tsx";
import ExpandableList from "../../../shared/components/expandable-list/expandable-list.tsx";
import Modal from "../../../shared/components/modal/modal.tsx";

export default function EditProfileComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [userInfos, setUserInfos] = useState<UserInfos | undefined>(undefined);
    const [modalIsOpened, setModalIsOpened] = useState<boolean>(false);
    const [genres, setGenres] = useState<string[] | undefined>(undefined);
    const [genresSelected, setGenresSelected] = useState<string[]>([]);
    const [artists, setArtists] = useState<string[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [email, setEmail] = useState<string>(userInfos?.user?.email ?? "");
    const [image, setImage] = useState<string>(userInfos?.user?.image ?? "");
    const [errorUserName, setErrorUserName] = useState<string | null>(null);
    const [errorEmail, setErrorEmail] = useState<string | null>(null);
    const [displayGenresList, setDisplayGenresList] = useState<boolean>(true);
    const [errorUpdate, setErrorUpdate] = useState<boolean>(false);
    const {jwtToken} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        const locationState: UserInfos = location.state.userInfos;
        setUserInfos(locationState);
        setImage(locationState?.user?.image ?? "");
        setUserName(locationState?.user?.userName ?? null);
        setEmail(locationState?.user?.email ?? "");
        setGenresSelected(locationState?.user.favoriteGenres);
        setArtists(locationState?.user.favoriteArtists);
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

    useEffect(() => {

    }, [modalIsOpened, artists]);

    function handleAddArtist(artists: string[]): void {
        setArtists(artists);
    }

    function handleCloseModal() {
        setModalIsOpened(false);
    }

    function handleSelectGenre(genre: string) {
        if (genresSelected.length > 0 && genresSelected.includes(genre)) {
            console.log("premiere condition")
            return setGenresSelected([...genresSelected.filter((genreItem) => genreItem !== genre)])
        }

        if (genresSelected.length < 3 && !genresSelected.includes(genre)) {
            console.log("second condition")
            return setGenresSelected([...genresSelected, genre]);
        }
    }

    async function submitForm(e: any) {
        e.preventDefault();
        const userNameRegex: RegExp = /^[a-zA-Z0-9_-]{3,20}$/
        const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/


        if (userName === null || userName?.length === 0) {
            console.log("userName is null")
            setErrorUserName("Username is required");
            return;
        }

        if (userName?.length <= 3 || userName?.length > 15) {
            setErrorUserName("Username must be between 3 and 15 characters");
            return;
        }

        if (email === null || email?.length === 0) {
            setErrorEmail("Email is required");
            return;
        }

        if (!userNameRegex.test(userName)) {
            setErrorUserName("UserName is not valid");
            return;
        }

        if (!emailRegex.test(email)) {
            setErrorEmail("Email is not valid");
            return;
        }


        setErrorUserName(null);
        setErrorEmail(null);

        const updateUserPayload: UpdateUser = {
            image: image.split(',')[1] ?? image,
            email: email,
            userName: userName,
            favoriteArtists: artists,
            favoriteGenres: genresSelected
        }

        if (updateUserPayload && userInfos &&
            updateUserPayload.image === userInfos?.user.image?.split(",")[1] &&
            updateUserPayload.email === userInfos?.user.email &&
            updateUserPayload.userName === userInfos?.user.userName &&
            updateUserPayload.favoriteArtists.every((artist: string) => userInfos?.user.favoriteArtists.includes(artist)) &&
            updateUserPayload.favoriteGenres.every((genre: string) => userInfos?.user.favoriteGenres.includes(genre))) {

            return navigate("/profile");
        }

        if (jwtToken && updateUserPayload) {
            console.log(updateUserPayload)
            try {
                const updateResult = await userService.updateUserInfos(jwtToken, updateUserPayload);
                if (updateResult !== undefined) {
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

    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (!validExtensions.includes(file.type)) {
            alert("Only jpg, JPEG and png are authorized!");
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

    function goToProfilePage() {
        navigate("/profile");
    }

    function onChangeUsername(e: ChangeEvent<HTMLInputElement>) {
        setUserName(e.target.value);
    }

    function onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    return (
        <div className="edit-profile-container">
            {errorUpdate ? (
                <Modal eventType="error" message="Cannot update your profile, please try again" handleClose={() => setErrorUpdate(!errorUpdate)} />
            ) : null}
            {modalIsOpened ? (
                <>
                    <ModalSearchArtists
                        addSearchedArtist={handleAddArtist}
                        toggleModal={handleCloseModal}
                        artistsSelected={artists}
                    >
                    </ModalSearchArtists>
                </>
                ) : null
            }
            <div className="edit-profile-content">
                <div className="buttons-navigation">
                    <button className="action-button back" onClick={goToProfilePage} disabled={isLoading}>
                        <span className="action-button-text">Back</span>
                    </button>
                    <button className="action-button next" onClick={submitForm} disabled={isLoading}>
                        <span className="action-button-text">Save</span>
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
                        onChange={handleFileChange}
                    />

                    <label htmlFor="fileInput" className="edit-button">
                        <EditIcon />
                    </label>

                </div>
                <div className="input-container">
                    <input className="form-input" id="nickname" placeholder="Username"
                           defaultValue={userInfos?.user?.userName} onChange={onChangeUsername}/>
                    {errorUserName ? (
                        <p className="error-input">{errorUserName}</p>
                    ) : null}
                    <input className="form-input" id="emailAddress" placeholder="Email"
                           defaultValue={userInfos?.user?.email} onChange={onChangeEmail}/>
                    {errorEmail ? (
                        <p className="error-input">{errorEmail}</p>
                    ) : null}
                </div>
                <ExpandableList
                    title="Favorite genres"
                    subTitle="(Max. 3)"
                    toggleExpand={handleToggleSelectGenre} />
                <div className="favorites-container">
                    {genresSelected.length === 0 || displayGenresList ? (
                        genres?.map((genre: string, index: number) => (
                            <div key={index}
                                 className={genresSelected.includes(genre) ?
                                     "favorites-selected-card" : "favorites-card"}
                                 onClick={() => handleSelectGenre(genre)}>
                                <p
                                    className={genresSelected.includes(genre) ?
                                        "favorite-selected-genres-text" :
                                        "favorite-genres-text"}>{genre}
                                </p>
                            </div>
                        ))
                    ) : genresSelected?.map((genre: string, index: number) => (
                            <div key={index} className="favorites-selected-card">
                                <p className="favorite-selected-genres-text">{genre}</p>
                            </div>
                        )
                    )}
                </div>
                <ExpandableList
                    title="Favorite artists"
                    subTitle="(Max. 3)"
                    toggleExpand={() => setModalIsOpened(true)}
                    forceIcon={true}/>
                {artists.length === 0 ? (
                        <div>
                            <p className="form-message">No artists selected</p>
                        </div>
                    ) :
                    (<div className="favorites-container">
                        {artists.map((artist, index) => (
                            <div className="favorites-selected-card" key={index}>
                                <p className="favorite-selected-genres-text" key={index}>{artist}</p>
                            </div>
                        ))}
                    </div>)
                }
            </div>
        </div>
    )
}
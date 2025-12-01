import './profile-page.scss';
import {useContext, useEffect, useState} from "react";
import type {UserInfos} from "../../../shared/interfaces/user.interface.ts";
import userService from "../../../shared/services/user.service.ts";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import ProfilePicture from "../../../shared/components/profile-picture/profile-picture.tsx";
import Loader from "../../../shared/components/loader/loader.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "../../../shared/components/footer/footer.tsx";
import ModalOverlay from "../../../shared/components/modal-overlay/modal-overlay.tsx";
import SettingsPage from "../edit-profile/settings/settings-page.tsx";

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<UserInfos | undefined>(undefined);
    const [userName, setUserName] = useState<string | null>(null);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [genresSelected, setGenresSelected] = useState<string[]>([]);
    const [artists, setArtists] = useState<string[]>([]);
    const [onSettings, setOnSettings] = useState<boolean>(false);
    const {jwtToken, userId} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (jwtToken) {
            const fetchUser = async () => {
                setIsLoading(true);
                try {
                    const fetched: UserInfos | null = await userService.getUserInfos(jwtToken);

                    if (fetched) {
                        setUserInfos(fetched);
                        setImage(fetched?.user?.image);
                        setGenresSelected(fetched?.user?.favoriteGenres);
                        setArtists(fetched?.user?.favoriteArtists);
                        setUserName(fetched?.user?.username ?? null);
                    }

                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUser();
        }
    }, [jwtToken]);

    const onClickEdit = () => {
        navigate("/profile/edit", {
            state: {
                userInfos: userInfos
            }
        });
    }

    return (
         isLoading ? <Loader /> : (
        <div className="profile-container" data-testid="profile-container">
            {jwtToken && userId && userInfos?.user?.username && onSettings && (
                <ModalOverlay
                    closed={() => setOnSettings(!onSettings)}
                    children={
                        <SettingsPage
                            jwtToken={jwtToken}
                            userId={userId}
                            email={userInfos.user.email}/>}
                />)
            }
                <div className="profile-header">
                <button
                    className="settings-icon"
                    onClick={() => setOnSettings(!onSettings)}
                    data-testid="edit-profile-button-settings-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 122.88 122.878" enableBackground="new 0 0 122.88 122.878" xmlSpace="preserve">
                        <g>
                            <path className="settings-icon" fill="#fff" fillRule="evenodd" clipRule="evenodd" d="M101.589,14.7l8.818,8.819c2.321,2.321,2.321,6.118,0,8.439l-7.101,7.101 c1.959,3.658,3.454,7.601,4.405,11.752h9.199c3.283,0,5.969,2.686,5.969,5.968V69.25c0,3.283-2.686,5.969-5.969,5.969h-10.039 c-1.231,4.063-2.992,7.896-5.204,11.418l6.512,6.51c2.321,2.323,2.321,6.12,0,8.44l-8.818,8.819c-2.321,2.32-6.119,2.32-8.439,0 l-7.102-7.102c-3.657,1.96-7.601,3.456-11.753,4.406v9.199c0,3.282-2.685,5.968-5.968,5.968H53.629 c-3.283,0-5.969-2.686-5.969-5.968v-10.039c-4.063-1.232-7.896-2.993-11.417-5.205l-6.511,6.512c-2.323,2.321-6.12,2.321-8.441,0 l-8.818-8.818c-2.321-2.321-2.321-6.118,0-8.439l7.102-7.102c-1.96-3.657-3.456-7.6-4.405-11.751H5.968 C2.686,72.067,0,69.382,0,66.099V53.628c0-3.283,2.686-5.968,5.968-5.968h10.039c1.232-4.063,2.993-7.896,5.204-11.418l-6.511-6.51 c-2.321-2.322-2.321-6.12,0-8.44l8.819-8.819c2.321-2.321,6.118-2.321,8.439,0l7.101,7.101c3.658-1.96,7.601-3.456,11.753-4.406 V5.969C50.812,2.686,53.498,0,56.78,0h12.471c3.282,0,5.968,2.686,5.968,5.969v10.036c4.064,1.231,7.898,2.992,11.422,5.204 l6.507-6.509C95.471,12.379,99.268,12.379,101.589,14.7L101.589,14.7z M61.44,36.92c13.54,0,24.519,10.98,24.519,24.519 c0,13.538-10.979,24.519-24.519,24.519c-13.539,0-24.519-10.98-24.519-24.519C36.921,47.9,47.901,36.92,61.44,36.92L61.44,36.92z"/>
                        </g>
                    </svg>
                </button>
                {image ? (
                    <ProfilePicture image={image} height={90} width={90}/>
                ) : null}
                <div className="profile-header-infos">
                    <p className="profile-header-infos-name" data-testid="profile-username">@{userName?.toLowerCase()}</p>
                </div>
                <div className="profile-header-buttons">
                    <button className="button-edit" onClick={onClickEdit} data-testid="edit-button">Edit</button>
                </div>
            </div>
            <div className="profile-body">
                <div className="experience">
                    <div className="experience-text">
                        <p className="experience-label">lvl.</p>
                        <h3 className="experience-value" data-testid="profile-level">{userInfos?.xp?.level}</h3>
                    </div>
                    <div className="experience-bar">
                        {userInfos?.xp?.currentXp && userInfos?.xp?.xpForNextLevel ? (
                            <>
                                <div className="experience-progression-bar"
                                     style={{width: ((userInfos?.xp?.currentXp - userInfos?.xp?.xpForPreviousLevel) / userInfos?.xp.xpForNextLevel) * 100 + '%'}}
                                     data-testid="profile-progression-bar">

                                </div>
                                <p className="experience-progression-text" data-testid="profile-progression-text">{userInfos?.xp.currentXp} / {userInfos?.xp.xpForNextLevel}</p>
                            </>
                        ) : null}
                    </div>
                    <div className="reputation">
                        <div className="reputation-infos">
                            <h2 className="grade">Grade : <span className="grade-label" data-testid="profile-grade-name">{userInfos?.xp?.gradeName}</span></h2>
                        </div>
                    </div>
                </div>
                <div className="profile-category">
                    <h3 className="title">Tastes</h3>
                    <div className="tastes-container">
                        <h4 className="tastes-label">Top genres</h4>
                        <div className="tastes-list">
                            {genresSelected && genresSelected.length > 0 ? genresSelected.map((genre: string, index: number) => (
                                <div key={index} className="tastes-list-item" data-testid="profile-genres">{genre}{index === genresSelected.length - 1 ? "" : ","}</div>
                            )) : <div className="tastes-list-item" data-testid="profile-genres">You don't have selected genres...</div>}
                        </div>
                    </div>
                    <div className="tastes-container">
                        <h4 className="tastes-label">Top artists</h4>
                        <div className="tastes-list">
                            {artists && artists.length > 0 ? artists.map((artist: string, index: number) => (
                                <div key={index} className="tastes-list-item" data-testid="profile-artists">{artist}{index === artists.length - 1 ? "" : ","}</div>
                            )) : <div className="tastes-list-item" data-testid="profile-artists">You don't have selected artists...</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-footer">
                <Footer />
            </div>
        </div>
    ))
}

export default ProfilePage;
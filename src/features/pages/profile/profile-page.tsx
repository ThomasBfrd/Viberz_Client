import './profile-page.scss';
import {useContext, useEffect, useState} from "react";
import type {UserInfos} from "../../../shared/interfaces/user.interface.ts";
import userService from "../../../shared/services/user.service.ts";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import ProfilePicture from "../../../shared/components/profile-picture/profile-picture.tsx";
import Loader from "../../../shared/components/loader/loader.tsx";
import {useNavigate} from "react-router-dom";
import Footer from "../../../shared/components/footer/footer.tsx";

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<UserInfos | undefined>(undefined);
    const [userName, setUserName] = useState<string | null>(null);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [genresSelected, setGenresSelected] = useState<string[]>([]);
    const [artists, setArtists] = useState<string[]>([]);
    const {jwtToken} = useContext(AuthContext);
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
                        setUserName(fetched?.user?.userName ?? null);
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
            <div className="profile-header">
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
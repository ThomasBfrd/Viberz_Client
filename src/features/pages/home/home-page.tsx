import {initiateSpotifyAuth} from "../../../shared/services/authentication.service.ts";
import {useContext, useEffect, useMemo, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import './home-page.css';
import {useNavigate} from "react-router-dom";
import ProfilePicture from "../../../shared/components/profile-picture/profile-picture.tsx";
import Loader from "../../../shared/components/loader/loader.tsx";
import type {MenuItem} from "../../../shared/interfaces/menu-item.interface.ts";
import {menuItems} from "../../../shared/const/menu-items.ts";
import MenuItemsScroll from "../../../shared/components/menu-items-scroll/menu-items-scroll.tsx";
import PersonIcon from "../../../shared/components/svg/person/person-icon.tsx";
import ModalOverlay from "../../../shared/components/modal-overlay/modal-overlay.tsx";
import WhitelistForm from "../../../shared/components/whitelist-form/whitelist-form.tsx";

export default function HomePage() {
    const {isLoggedIn, jwtToken, guest} = useContext(AuthContext);
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [categoryType, setCategoryType] = useState<string>("all");
    const [modalWhitelist, setModalWhitelist] = useState<boolean>(false);

    const filteredCategories = useMemo(() => {
        if (categoryType === 'all') {
            return menuItems;
        }

        return menuItems.filter((item: MenuItem) => (item.value === categoryType));
    }, [categoryType]);

    const types = useMemo(() => {
        const types: MenuItem[] = [];
        menuItems.forEach((menuItem: MenuItem) => {
            if (!types.some((type: MenuItem) => type.short === menuItem.short)) {
                types.push(menuItem);
            }
        })
        return types;
    }, [])

    useEffect(() => {
        setLoading(true);

        const userStorage = localStorage.getItem('user');
        if (userStorage) {
            const user = JSON.parse(userStorage);
            setUsername(user.username);
            setUserImage(user.image);
        }
        setLogged(isLoggedIn);
        setLoading(false);

    }, [isLoggedIn]);

    const handleChangeWhitelistedStatus = (isWhitelisted: boolean) => {

        if (isWhitelisted) {
            setModalWhitelist(false);
            return initiateSpotifyAuth();
        }
    }

    const onRedirectToCategory = (path: string): void => {
        if (path && isLoggedIn) {
            navigate(path);
        }

        return;
    }

    const onRedirectToProfile = (): void => {
        if (isLoggedIn) {
            navigate('/profile');
        }
    }

    const handleChangeCategory = (type: string) => {
        setCategoryType(type);
    }

    const connectAsGuest = () => {
        const stored = localStorage.getItem('viberz-whitelist');
        if (stored) {
            localStorage.removeItem('viberz-whitelist');
        }

        return navigate("/callback")
    }

    return (
        <div className="page-transition home-container" data-testid="home-container">
            {modalWhitelist && (
                <ModalOverlay
                    closed={() => setModalWhitelist(!modalWhitelist)}
                    isClosable={true}
                    children={<WhitelistForm isWhitelisted={handleChangeWhitelistedStatus} />}
                />
            )}
            {loading ? (
                <div className="home-loader">
                    <Loader />
                </div>
                ) : null}
            <div className="home-header">
                <div className="header-logo-profile">
                    <div className="header-logo" data-testid="home-title" onClick={() => navigate(('/'))}>Viberz</div>
                    {logged && (
                        <div onClick={onRedirectToProfile}>
                            {userImage ? (
                                <ProfilePicture image={userImage} height={"50px"} width={"50px"} />
                            ) : (
                                <div className="icon-profile">
                                    <PersonIcon height={"50px"} width={"50px"} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {logged ? (
                    <>
                        <div className="hello">
                            <h1 className="hello-text" data-testid="home-username">Hello{username ? `, ${username}` : " Guest"}</h1>
                        </div>
                        {guest && (
                            <div className="login-actions">
                                <button
                                    className="connect-button"
                                    data-testid="home-connect-button"
                                    onClick={() => setModalWhitelist(!modalWhitelist)}>Connect with Spotify
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="not-connected" data-testid="home-not-connected">
                        <h3 className="hello-text">Login to play and discover</h3>
                        <div className="login-actions">
                            <button
                                className="connect-button"
                                data-testid="home-connect-button"
                                onClick={() => setModalWhitelist(true)}>Connect with Spotify
                            </button>
                            <p className="connection-button-text">Or</p>
                            <button
                                className="connect-button"
                                data-testid="home-connect-guest-button"
                                onClick={connectAsGuest}>Guest
                            </button>
                        </div>
                    </div>
                )
                }
                <div className="header-menu">
                    <MenuItemsScroll currentItem={categoryType} items={types} setCurrentItem={handleChangeCategory} />
                </div>
            </div>
            <div className="home-body">
                {filteredCategories && filteredCategories.map((menuItem: MenuItem, index: number) => {
                    return (
                        <div
                            className={menuItem.available ? "home-category" : "home-category disabled"}
                            style={{backgroundImage : `url(${menuItem.background})`}}
                            onClick={() => jwtToken && (onRedirectToCategory(menuItem.path))}
                            key={index}>
                            <span className="home-category-type">{menuItem.value}</span>
                            <h3 className="home-category-name" data-testid="home-category-name">{menuItem.label}</h3>
                        </div>
                    )
                })}
            </div>
            <div className="home-footer">
                <p className="home-footer-text"
                    onClick={() => navigate("/legal-notice")}>Legal Notice</p>
                <p className="home-footer-text"
                   onClick={() => navigate("/privacy")}>Privacy</p>
            </div>
        </div>
    )

}
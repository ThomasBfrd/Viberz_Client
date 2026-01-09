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
    const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
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

    const checkWhitelistedStored = () => {
        const whiteListFromStorage = localStorage.getItem('viberz-whitelist');

        if (whiteListFromStorage) {
            setIsWhitelisted(JSON.parse(whiteListFromStorage));
        } else {
            setModalWhitelist(true);
            setIsWhitelisted(false);
        }
    }

    const handleChangeWhitelistedStatus = (isWhitelisted: boolean) => {

        if (isWhitelisted) {
            setModalWhitelist(false);
            localStorage.setItem('viberz-whitelist', JSON.stringify(true));
            return initiateSpotifyAuth();
        } else {
            localStorage.removeItem('viberz-whitelist');
        }

        setIsWhitelisted(isWhitelisted);
    }

    function onRedirectToCategory(path: string) {
        if (path && isLoggedIn) {
            navigate(path);
        }

        return;
    }

    function onRedirectToProfile() {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            checkWhitelistedStored();

            if (isWhitelisted) {
                initiateSpotifyAuth();
            }
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
                    {logged ? (
                        <div className="icon-profile" onClick={onRedirectToProfile}>
                            {userImage ? (
                                <ProfilePicture image={userImage} height={"50px"} width={"50px"} />
                            ) : (
                                <PersonIcon height={"50px"} width={"50px"} />
                            )}
                        </div>
                    ) : null}
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
                                    onClick={checkWhitelistedStored}>Connect with Spotify
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
                                onClick={checkWhitelistedStored}>Connect with Spotify
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
                            onClick={() => jwtToken ? (onRedirectToCategory(menuItem.path)) : checkWhitelistedStored()}
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
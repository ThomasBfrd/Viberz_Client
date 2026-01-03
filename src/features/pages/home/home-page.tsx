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

export default function HomePage() {
    const {isLoggedIn, jwtToken} = useContext(AuthContext);
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [categoryType, setCategoryType] = useState<string>("all");

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

        const timeout = setTimeout(() => {
            const userStorage = localStorage.getItem('user');
            if (userStorage) {
                const user = JSON.parse(userStorage);
                setUsername(user.username);
                setUserImage(user.image);
            }
            setLogged(isLoggedIn);
            setLoading(false);
        }, 250);

        return () => clearTimeout(timeout);
    }, [isLoggedIn]);


    function onRedirectToCategory(path: string) {
        if (path) {
            navigate(path);
        }
    }

    function onRedirectToProfile() {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            initiateSpotifyAuth();
        }
    }

    const handleChangeCategory = (type: string) => {
        setCategoryType(type);
    }

    return (
        <div className="page-transition home-container" data-testid="home-container">
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
                                <ProfilePicture image={userImage} height={50} width={50} />
                            ) : null}
                        </div>
                    ) : null}
                </div>
                {logged ? (
                    <>
                        <div className="hello">
                            <h1 className="hello-text" data-testid="home-username">Hello{username ? `, ${username}` : ""}</h1>
                        </div>
                    </>
                ) : (
                    <div className="not-connected" data-testid="home-not-connected">
                        <h3 className="hello-text">Login to play and discover</h3>
                        <button
                            className="connect-button"
                            data-testid="home-connect-button"
                            onClick={() => initiateSpotifyAuth()}>Connect with Spotify</button>
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
                            onClick={() => jwtToken ? (onRedirectToCategory(menuItem.path)) : initiateSpotifyAuth()}
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
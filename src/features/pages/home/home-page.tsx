import {initiateSpotifyAuth} from "../../../shared/services/authentication-service.ts";
import {type RefObject, useContext, useEffect, useMemo, useRef, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import './home-page.css';
import {useNavigate} from "react-router-dom";
import {useDraggable} from "react-use-draggable-scroll";
import ProfilePicture from "../../../shared/components/profile-picture/profile-picture.tsx";
import Loader from "../../../shared/components/loader/loader.tsx";

export type MenuType = 'all' | 'play' | 'listen' | 'learn';

export interface MenuItem {
    name: string;
    type: MenuType;
    path: string;
    available: boolean;
    background: string
}

const menuItems: Array<MenuItem> = [
    {
        name: 'Guess the genre',
        type: 'play',
        path: '/guess-genre',
        available: true,
        background: "img/background-1.webp"
    },
    {
        name: 'Guess the song',
        type: 'play',
        path: '/guess-song',
        available: false,
        background: "img/background-2.webp"
    },
    {
        name: 'Share and discover',
        type: 'listen',
        path: '/playlists',
        available: false,
        background: "img/background-3.webp"
    },
    {
        name: 'Learn the structures',
        type: 'learn',
        path: '/learn-structures',
        available: false,
        background: "img/background-4.webp"
    },
]

export default function HomePage() {
    const {isLoggedIn} = useContext(AuthContext);
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [categoryType, setCategoryType] = useState<string>("all");

    const filteredCategories = useMemo(() => {
        const category: string = categoryType.toLowerCase();
        if (category === 'all') {
            return menuItems;
        }

        return menuItems.filter((item: MenuItem) => (item.type === category));
    }, [categoryType]);

    const types = useMemo(() => {
        const types: string[] = [];
        menuItems.forEach((menuItem: MenuItem) => {
            const formatType = menuItem.type[0].toUpperCase() + menuItem.type.slice(1).toString();
            if (!types.includes(formatType)) {
                types.push(formatType);
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
                setUserName(user.userName);
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

    return (
        <div className="home-container">
                <>
                {loading ? (
                    <div className="home-loader">
                        <Loader />
                    </div>
                    ) : null}
                    <div className="home-header">
                        {logged ? (
                            <>
                                <div className="icon-profile" onClick={onRedirectToProfile}>
                                    {userImage ? (
                                        <ProfilePicture image={userImage} height={50} width={50} />
                                    ) : null}
                                </div>
                                <div className="hello">
                                    <h1 className="hello-text">Hello{userName ? `, ${userName}` : ""}</h1>
                                </div>
                            </>
                        ) : (
                            <div className="not-connected">
                                <h3 className="hello-text">Login to play and discover</h3>
                                <button className="connect-button" onClick={() => initiateSpotifyAuth()}>Connect with Spotify</button>
                            </div>
                        )
                        }
                        <div className="header-menu">
                            <div className={categoryType === "all" ? "menu-item menu-item-active" : "menu-item"} onClick={() => setCategoryType("All")}>
                                <p className="menu-item-text">All</p>
                            </div>
                            {types.map((type: string, index: number) => {
                                return (
                                    <div className={categoryType === type ? "menu-item menu-item-active" : "menu-item"} key={index} onClick={() => setCategoryType(type)}>
                                        <p className="menu-item-text">{type}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="home-body">
                        {filteredCategories && filteredCategories.map((menuItem: MenuItem, index: number) => {
                            return (
                                <div
                                    className={menuItem.available ? "home-category" : "home-category disabled"}
                                    style={{backgroundImage : `url(${menuItem.background})`}}
                                    onClick={() => onRedirectToCategory(menuItem.path)}
                                    key={index}>
                                    <div className="home-category-type">{menuItem.type}</div>
                                    <div className="home-category-name">{menuItem.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </>

        </div>
    )

}
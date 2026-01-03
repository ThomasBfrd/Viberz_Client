import {useLocation, useNavigate} from "react-router-dom";
import {useMemo, useState} from "react";
import './footer.scss';
import clsx from "clsx";

export interface Footer {
    name: string;
    path: string;
}

export interface FooterProps {
    onCancel?: (path: string) => void;
    seeLikedPlaylists?: () => void;
    path?: string;
    userLikes?: boolean;
}

const routes: Array<Footer> = [
    {
        name: "Home",
        path: "/"
    },
    {
        name: "Liked",
        path: "/discover/all"
    },
    {
        name: "Profile",
        path: "/profile"
    }
];

const Footer = ({onCancel, userLikes = false, path, seeLikedPlaylists}: FooterProps) => {
    const location = useLocation();
    const {likedButtonClicked} = location.state ?? false;
    const navigate = useNavigate();
    const [likedDisplayed, setLikedDisplayed] = useState<boolean>(likedButtonClicked);

    const actualPath: string = useMemo(() => {
        return location.pathname;
    }, [location.pathname]);
    
    const availableRoutes = useMemo(() => {
        if (!userLikes) {
            return routes.filter(route => route.path !== "/discover/all");
        } else {
            return routes;
        }
    }, [userLikes])

    function onRedirectTo(targetPath: string) {
        if (userLikes && targetPath === "/discover/all") {
            setLikedDisplayed(!likedDisplayed);
            return seeLikedPlaylists && seeLikedPlaylists();
        }

        if (onCancel) {
            return onCancel(targetPath);
        } else {
            return navigate(targetPath);
        }
    }

    return (
        <div className="footer-container">
            {availableRoutes.map((route: Footer, index: number) => {
                return (
                    <div
                        className={clsx(
                            "footer-item",
                            actualPath === route.path && "current-path",
                            userLikes && !likedDisplayed && route.name === "Liked" && "footer-item-likes",
                            userLikes && likedDisplayed && route.name === "Liked" && "active-likes",
                            userLikes && route.name === "Liked" && likedButtonClicked && "active-likes"
                        )}
                        key={index}
                        onClick={() => onRedirectTo(path ?? route.path)}>
                        <p>{route.name}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Footer;
import {useLocation, useNavigate} from "react-router-dom";
import {useMemo} from "react";
import './footer.scss';
import clsx from "clsx";

export interface Footer {
    name: string;
    path: string;
}

export interface FooterProps {
    onCancel?: (path: string) => void;
    seeLikedPlaylists?: () => void;
    likedButtonClicked?: boolean;
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

const Footer = ({onCancel, userLikes = false, path, seeLikedPlaylists, likedButtonClicked}: FooterProps) => {
    const location = useLocation();
    const navigate = useNavigate();

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

    const onRedirectTo = (targetPath: string) => {
        if (userLikes && targetPath === "/discover/all") {
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
                            userLikes && !likedButtonClicked && route.name === "Liked" && "footer-item-likes",
                            userLikes && likedButtonClicked && route.name === "Liked" && "footer-item-likes footer-item-likes-active"
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
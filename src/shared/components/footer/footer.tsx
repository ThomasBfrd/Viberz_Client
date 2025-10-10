import {useLocation, useNavigate} from "react-router-dom";
import {useMemo} from "react";
import './footer.scss';

export interface Footer {
    name: string;
    path: string;
}

export interface FooterProps {
    onCancel?: (path: string) => void;
}

const Footer = ({onCancel}: FooterProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const actualPath: string = useMemo(() => {
        return location.pathname;
    }, [location.pathname]);
    const routes: Array<Footer> = [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "Profile",
            path: "/profile"
        }
    ];

    function onRedirectTo(path: string) {
        if (actualPath === path) {
            return;
        }

        if (onCancel) {
            return onCancel(path);
        } else {
            return navigate(path);
        }

    }

    return (
        <div className="footer-container">
            {routes.map((route: Footer, index: number) => {
                return (
                    <div className={actualPath === route.path ? "footer-item current-path" : "footer-item"} key={index} onClick={() => onRedirectTo(route.path)}>
                        <p>{route.name}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Footer;
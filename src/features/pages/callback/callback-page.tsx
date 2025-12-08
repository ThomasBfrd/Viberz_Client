import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import type {UserInfos} from "../../../shared/interfaces/user.interface.ts";
import userService from "../../../shared/services/user.service.ts";
import Loader from "../../../shared/components/loader/loader.tsx";
import type {AuthData} from "../../../core/interfaces/auth-data.interface.ts";

const CallbackPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, setUser, jwtToken, userId } = useContext(AuthContext);

    useEffect(() => {

        if (window.location.hash === "#_=_") {
            window.location.hash = "";
        }

        const params: URLSearchParams = new URLSearchParams(window.location.search);
        const code: string | null = params.get('code');

        if (!code) {
            navigate('/home');
            return;
        }

        const fetchToken = async () => {
            try {
                    const res: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/authentication/getSpotifyAccess`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, redirectUri: import.meta.env.VITE_REDIRECT_URI }),
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data: AuthData = await res.json();
                return login(data);

            } catch (err) {
                console.error("Can't retrieve user's token:", err);
            }
        }

        fetchToken();

        return () => {}

    }, [])

    useEffect(() => {
        if (!jwtToken || !userId || user) return;

        const getUserInfos = async () => {
            setIsLoading(true);
            try {
                const fetched: UserInfos | null = await userService.getUserInfos(jwtToken, userId);

                if (fetched) {
                    setUser(fetched);
                }

            } catch (err) {
                console.error("Erreur getUserInfos:", err);
            } finally {
                setIsLoading(false);
            }
        };

        getUserInfos();
    }, [jwtToken, user, setUser, userId]);

    useEffect(() => {
        if (!user) return;
        if (!user?.user.username || user?.user.username.trim() === "") {
            navigate("/profile/edit", {state: {userInfos: user}});
            return;
        }
        navigate("/home");
        return;
    }, [navigate, user]);

    return <div>{isLoading ? <Loader /> : null}</div>;
};

export default CallbackPage;
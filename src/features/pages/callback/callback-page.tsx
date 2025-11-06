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
    const { login, user, setUser, jwtToken } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) {
            navigate('/home');
        }

        const fetchToken = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getSpotifyToken`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, redirectUri: import.meta.env.VITE_REDIRECT_URI }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: AuthData = await res.json();
                login(data); // met à jour le context (jwtToken)
                localStorage.setItem('refreshToken', data.refreshToken);
            } catch (err) {
                console.error("Erreur getSpotifyToken:", err);
            }

        }

        fetchToken();

        return () => {}

    }, [])

    useEffect(() => {
        if (!jwtToken || user) return;

        const getUserInfos = async () => {
            setIsLoading(true);
            try {
                const fetched: UserInfos | null = await userService.getUserInfos(jwtToken);
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
    }, [jwtToken, user, setUser]);

    // 3) Navigation : seulement AFTER avoir `user`
    useEffect(() => {
        if (!user) return;
        if (!user?.user.userName || user?.user.userName.trim() === "") {
            navigate("/profile/edit", {state: {userInfos: user}});
            return;
        }
        navigate("/home");
    }, [navigate, user]);

    return <div>{isLoading ? <Loader /> : null}</div>;
};

export default CallbackPage;
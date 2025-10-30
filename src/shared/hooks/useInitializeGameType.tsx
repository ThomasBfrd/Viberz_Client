import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../core/context/auth-context.tsx";

const UseInitializeGameType = () => {
    const params = useLocation();
    const navigate = useNavigate();
    const {jwtToken} = useContext(AuthContext);
    const [gameType, setGameType] = useState<string | null>(null);

    useEffect(() => {
        if (!jwtToken) {
            navigate("/home");
            return;
        }
        
        const query: string = params.pathname ? params.pathname.split("/")[1] : "";
        
        if (query.length > 0) {
            setGameType(query);
        }
        
    }, [jwtToken, navigate, params.pathname]);
    
    return gameType;
};

export default UseInitializeGameType;
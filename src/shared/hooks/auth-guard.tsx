import {Navigator} from "expo-router";

export const AuthGuard = ({user, children}) => {
    if (!user) {
        return <Navigator to={"/"} replace />
    }

    return children;
};
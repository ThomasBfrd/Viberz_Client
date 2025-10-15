import {base64ToImage} from "../utils/base64Images.ts";
import type {UserInfos} from "../interfaces/user.interface.ts";
import type {UpdateUser} from "../interfaces/update-user.interface.ts";

const userService = {
    getUserInfos: async (jwtToken: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data: UserInfos = await response.json();
            const userInfo: UserInfos = {
                user: {
                    userName: data.user.userName ?? null,
                    email: data?.user.email,
                    image: data?.user.image?.includes("base64") ? data?.user.image : base64ToImage(data?.user.image),
                    userType: data?.user.userType,
                    favoriteArtists: data?.user.favoriteArtists,
                    favoriteGenres: data?.user.favoriteGenres,
                },
                xp: data.xp,
            };

            const userStorage: {userName: string; image: string;} = {userName: userInfo?.user.userName, image: userInfo?.user.image};
            localStorage.setItem('user', JSON.stringify(userStorage));

            return userInfo;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
    },
    updateUserInfos: async (jwtToken: string, updateUserInfoPayload: UpdateUser) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateUserInfoPayload)
            });
            const data: UserInfos = await response.json();
            const userInfo: UserInfos = {
                user: {
                    userName: data?.user.userName,
                    email: data?.user.email,
                    image: data?.user.image?.includes("base64") ? data?.user.image : base64ToImage(data?.user.image ?? ""),
                    userType: data?.user.userType,
                    favoriteArtists: data?.user.favoriteArtists,
                    favoriteGenres: data?.user.favoriteGenres
                },
                xp: data.xp
            };
            return userInfo;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
    }
}

export default userService;
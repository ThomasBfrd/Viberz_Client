import {base64ToImage} from "../utils/base64-images.ts";
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

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return null;
            }

            const data: UserInfos = await response.json();

            if (!data.user || !data.user.email) {
                return null;
            }


            const userInfo: UserInfos = {
                user: {
                    username: data.user.username ?? null,
                    email: data?.user.email,
                    image: data?.user.image?.includes("base64") ? data?.user.image : base64ToImage(data?.user.image),
                    userType: data?.user.userType,
                    favoriteArtists: data?.user.favoriteArtists,
                    favoriteGenres: data?.user.favoriteGenres,
                },
                xp: data.xp,
            };

            const userStorage: {userName: string; image: string;} = {
                userName: userInfo?.user.username,
                image: userInfo?.user.image
            };
            localStorage.setItem('user', JSON.stringify(userStorage));

            return userInfo;

        } catch (error) {
            console.error('Can\'t get user infos:', error);

            return null;
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

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return null;
            }

            const data: UserInfos = await response.json();

            if (!data.user) {
                return null;
            }

            const userInfo: UserInfos = {
                user: {
                    username: data?.user.username,
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
            console.error('Can\'t update your profile:', error);
            return null;
        }
    },

    deleteUser: async (jwtToken: string, userId: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userId)
            });

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return null;
            }

            const data: boolean = await response.json();

            if (!data) {
                return null;
            }

            return data;

        } catch (error) {
            console.error('Can\'t update your profile:', error);
            return null;
        }
    }
}

export default userService;
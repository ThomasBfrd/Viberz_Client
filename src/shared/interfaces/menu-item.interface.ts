import type {MenuType} from "../../features/pages/home/home-page.tsx";

export export interface MenuItem {
    name: string;
    type: MenuType;
    path: string;
    available: boolean;
    background: string
}
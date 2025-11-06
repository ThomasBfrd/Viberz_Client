import type {MenuType} from "../types/menu.type.ts";

export interface MenuItem {
    name: string;
    type: MenuType;
    path: string;
    available: boolean;
    background: string
}
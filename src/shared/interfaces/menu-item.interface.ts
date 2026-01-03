import type {MenuType} from "../types/menu.type.ts";
import type {BaseItem} from "./family-genres.interface.ts";

export interface MenuItem extends BaseItem<MenuType> {
    available: boolean;
    background: string
}
export interface BaseItem<T> {
    label: string;
    short: string;
    path: string;
    value: T;
}

export type Item = BaseItem<string>;

export interface FamilyGenres extends BaseItem<number>{
    id: number;
}
export interface PaginatedData<T> {
    accessToken: string;
    items: Array<T>;
    totalItems: number;
    pageSize: number;
    currentPage: number;
}
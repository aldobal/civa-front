export interface User {
    id: number | null;
    username: string;
    token: string | null;
    roles?: string[];
}
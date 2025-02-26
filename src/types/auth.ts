export enum AuthStatus {
    IDLE = "idle",
    LOADING = "loading",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
}
export interface UserInfo {
    email: string;
    name: string;
    password: string;
    id: number | null;
    role: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    loading: boolean;
    error: string | null;
    status: AuthStatus;
}
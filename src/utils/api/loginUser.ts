import { api } from "@/utils/api/instanse";

interface UserLoginParams {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    loginSucceeded: true;
}

export const postUserLogin = async ({
    params,
    config,
}: RequestParams<UserLoginParams>) =>
    api.post<TokenResponse>('/Auth/login', params, config);
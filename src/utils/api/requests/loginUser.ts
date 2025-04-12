import { api } from "@/utils/api/instanse";

export const postUserLogin = async ({
    params,
    config,
}: RequestParams<UserLoginParams>) =>
    api.post<TokenResponse>('/Auth/login', params, config);
import { api } from "@/utils/api/instanse";

export const getUserDetails = async ({
    params,
}: RequestParams<GetUserDetailsParams>) => {
    return api.get<ProfileDto>(`/User/${params.userId}`, { params });
};

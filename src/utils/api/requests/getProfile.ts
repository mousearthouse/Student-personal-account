import { api } from "@/utils/api/instanse";

export const getProfile = async () => {
    return api.get<UserProfileDto>('/Profile');
};
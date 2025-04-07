import { api } from "@/utils/api/instanse";

export const getStudent = async () => {
    return api.get<UserProfileDto>('/Profile/student');
};
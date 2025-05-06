import { api } from "@/utils/api/instanse";

export const getStudent = async () => {
    return api.get<StudentDto>('/Profile/student');
};
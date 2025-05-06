import { api } from "@/utils/api/instanse";

export const getEmployee = async () => {
    return api.get<EmployeeDto>('/Profile/employee');
};
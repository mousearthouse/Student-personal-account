import { api } from "@/utils/api/instanse";

export const postUsefulService = async (serviceData: UsefulServiceEditCreateDto) => {
    return api.post('/UsefulServices', serviceData);
};
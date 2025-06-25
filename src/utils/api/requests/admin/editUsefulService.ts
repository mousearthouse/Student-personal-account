import { api } from "@/utils/api/instanse";

export const editUsefulService = async (
    usefulServiceId: string,
    serviceData: UsefulServiceEditCreateDto
) => {
    return api.put(`/UsefulServices/${usefulServiceId}`, serviceData);
};

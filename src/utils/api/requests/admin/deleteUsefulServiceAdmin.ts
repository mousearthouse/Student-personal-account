import { api } from "@/utils/api/instanse";

export const deleteUsefulServiceAdmin = async ({
    params,
}: RequestParams<DeleteUsefulService>) => {
    return api.delete(`/UsefulServices/${params.usefulServiceId}`, { params });
};
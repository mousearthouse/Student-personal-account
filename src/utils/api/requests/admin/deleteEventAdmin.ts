import { api } from "@/utils/api/instanse";

export const deleteEventAdmin = async ({
    params,
}: RequestParams<DeleteEvent>) => {
    return api.delete('/Events', { params });
};
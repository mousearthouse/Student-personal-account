import { api } from "@/utils/api/instanse";

export const getUsefulServices = async ({
    params,
}: RequestParams<UsefulServicesParams>) =>
    api.get<UsefulServiceDtoPagedListWithMetadata>('/UsefulServices', { params });
import { api } from "@/utils/api/instanse";
import qs from "qs";

export const getUsefulServices = async ({
    params,
}: RequestParams<UsefulServicesParams>) =>
    api.get<UsefulServiceDtoPagedListWithMetadata>('/UsefulServices', { params, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) });
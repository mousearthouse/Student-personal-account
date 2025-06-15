import { api } from "@/utils/api/instanse";

export const getUsersList = async ({
    params,
}: RequestParams<GetUsersListParams>) => {
    return api.get<ProfileShortDtoPagedListWithMetadata>(`/User/list?email=${params.email}&name=${params.name}&filterLastName=${params.filterLastName}&page=${params.page}&pageSize=${params.pageSize}`, { params });
};

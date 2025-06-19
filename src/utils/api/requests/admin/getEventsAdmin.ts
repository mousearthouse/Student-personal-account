import { api } from "@/utils/api/instanse";

export const getEventsAdmin = async ({
    params,
}: RequestParams<GetEventsAdminParams>) =>
    api.get<EventShortDtoPagedListWithMetadata>('/Events', { params });
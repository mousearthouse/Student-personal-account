import { api } from "@/utils/api/instanse";

export const getEventsList = async ({
    params,
}: RequestParams<GetEventsListParams>) =>
    api.get<EventShortDtoPagedListWithMetadata>('/Events/public', { params });
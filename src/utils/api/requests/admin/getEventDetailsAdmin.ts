import { api } from "@/utils/api/instanse";

export const getEventDetailsAdmin = async ({
    params,
}: RequestParams<GetEventDetailsParams>) =>
    api.get<EventDto>(`/Events/${params.id}`, { params });
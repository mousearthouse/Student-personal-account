import { api } from "@/utils/api/instanse";

export const getEventDetails = async ({
    params,
}: RequestParams<GetEventDetailsParams>) =>
    api.get<EventDto>(`/Events/public/${params.id}`, { params });
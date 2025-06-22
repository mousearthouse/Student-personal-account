import { api } from "@/utils/api/instanse";

export const getEventIsParticipant = async ({
    params,
    config,
}: RequestParams<GetEventIsParticipantParams>) =>
    api.get(`/Events/is_participant/${params.id}`, { params });
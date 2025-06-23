import { api } from "@/utils/api/instanse";

export const postEvent = async (eventData: EventCreateDto) => {
    return api.post('/Events', eventData);
};
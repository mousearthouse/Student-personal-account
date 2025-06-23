import { api } from "@/utils/api/instanse";

export const editEventStatus = async (eventData: EditEventStatus) => {
    return api.put('/Events/status', eventData);
};
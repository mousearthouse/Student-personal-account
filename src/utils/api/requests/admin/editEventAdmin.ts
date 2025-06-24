import { api } from "@/utils/api/instanse";

export const editEventAdmin = async (eventData: EventEditDto) => {
    return api.put('/Events', eventData);
};
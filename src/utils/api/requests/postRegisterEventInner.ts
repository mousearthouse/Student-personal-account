import { api } from "@/utils/api/instanse";

export const postRegisterEventInner = async (info: EventInnerRegisterDto) => {
    return api.post('/Events/register/inner', info);
};
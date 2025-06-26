import { api } from "@/utils/api/instanse";

export const postRegisterEventExternal = async (info: EventExternalRegisterDto) => {
    return api.post('/Events/register/external', info);
};
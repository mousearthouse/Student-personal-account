import { api } from "@/utils/api/instanse";

export const editProfilePhoto = async (file: AvatarUpdateDto) => {
    return api.put('/Profile/avatar', { fileId: file.fileId });
};
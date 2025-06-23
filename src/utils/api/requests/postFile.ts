import { api } from "@/utils/api/instanse";

export const handleUpload = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('File', file);
    return api.post<FileResultDto>('/Files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
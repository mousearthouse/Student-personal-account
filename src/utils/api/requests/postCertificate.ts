import { api } from "@/utils/api/instanse";

export const postCertificate = async (certificateData: CertificateCreateDto) => {
    return api.post('/Certificates', certificateData);
};
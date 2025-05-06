import { api } from "@/utils/api/instanse";

export const getCertificates = async ({
    params,
}: RequestParams<GetCertificatesParams>) => {
    return api.get<CertificateDto[]>(`/Certificates/userType/${params.userType}/entity/${params.ownerId}`, { params });
};

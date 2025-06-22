export const EmploymentTypesTranslations: Record<EmploymentTypes, string> = {
    MainPlace: 'Основное место',
    PartTime: 'Совместительство',
    InnerPartTime: 'Внутреннее совместительство',
    Freelance: 'Фриланс',
};

export const CertificateStatusTranslations: Record<CertificateStatus, string> = {
    Created: 'Создан',
    InProgress: 'В процессе',
    Finished: 'Готов',
};

export const CertificateTypeTranslations: Record<CertificateType, string> = {
    ForPlaceWhereNeeded: 'По месту требования',
    PensionForKazakhstan: 'В пенсионный фонд Казахстана',
};

export const CertificateStaffTypeTranslations: Record<CertificateStaffType, string> = {
    ForPlaceOfWork: 'По месту работы',
    ForExperience: 'Для подтверждения стажа',
    ForVisa: 'Для визы',
    ForWorkBookCopy: 'Копия трудовой книжки',
};

export const CertificateUserTypeTranslations: Record<CertificateUserType, string> = {
    Student: 'Студент',
    Employee: 'Сотрудник',
};

export const CertificateReceiveTypeTranslations: Record<CertificateReceiveType, string> = {
    Electronic: 'Электронная',
    Paper: 'Бумажная',
};

export const statusMap: Record<string, string> = {
    'Draft': 'Черновик',
    'Actual': 'Опубликовано',
    'Finished': 'Завершено',
    'Archived': 'Архивировано'
};

export const eventFormatMap: Record<string, string> = {
    'Online': 'Онлайн',
    'Offline': 'Офлайн',
};
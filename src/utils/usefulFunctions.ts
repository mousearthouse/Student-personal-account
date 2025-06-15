import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { API_URL } from './constants/constants';

export const useValidDate = () => {
    const { t } = useTranslation();

    return (dateStr?: string) => {
        const date = dateStr ? new Date(dateStr) : null;
        return date ? format(date, 'dd.MM.yyyy') : t('common.noData');
    };
};

export const getImageUrl = (id: string) => {
    return `${API_URL}Files/${id}`;
};
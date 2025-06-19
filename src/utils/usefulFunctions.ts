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

export const getStatusClass = (status: EventStatus) => {
    switch (status) {
    case 'Actual':
        return 'green';
    case 'Finished':
        return 'lime';
    case 'Archive':
        return 'black';
    default:
        return 'gray';
    }
};

export const formatDate = (date?: string) => {
    const targetDate = date ? new Date(date) : new Date();

    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return `${dateFormatter.format(targetDate)} (${timeFormatter.format(targetDate)})`;
};
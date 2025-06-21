import './adminPage.scss';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import deleteIcon from '@/assets/icons/delete.svg';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@/utils/constants/constants';
import { formatDate, getStatusClass } from '@/utils/usefulFunctions';
import { statusMap } from '@/utils/constants/translations';
import { getEventDetailsAdmin } from '@/utils/api/requests/admin/getEventDetailsAdmin';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';  
import GeoMap from '@/components/GeoMap/GeoMap';

const AdminEventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [eventDetails, setEventDetails] = useState({} as EventDto);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getImageUrl = () => {
        if (eventDetails.picture) {
            return `${API_URL}Files/${eventDetails.picture.id}`;
        }
        return 'src/assets/react.svg';
    };

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            try {
                const response = await getEventDetailsAdmin({ params: { id } });
                setEventDetails(response.data);
            } catch (error) {
                console.error('Ошибка при получении деталей мероприятия:', error);
            }
        };

        fetchEventDetails();
    }, [id]);

    console.log(eventDetails);

    return (
        <div className="events-page">
            <div className="events-page-content">
                <div>
                    <h1>Мероприятия</h1>
                </div>
                <span className="page-link" onClick={() => navigate('/')}>Главная / </span>
                <span className="page-link" onClick={() => navigate('/admin')}>Администрирование / </span>
                <span className="page-link" onClick={() => navigate('/admin/events')}>Мероприятия / </span>
                <span className="page-link-blue"> {eventDetails.title}</span>
                <div>
                    <div className="event-name">
                        <h2>{eventDetails.title}</h2>
                        <div className={"event-status " + getStatusClass(eventDetails.status)}>
                            <span>{statusMap[eventDetails.status] || eventDetails.status}</span>
                        </div>
                        <img src={editIcon} onClick={() => console.log(`Редактирование мероприятия ${eventDetails.id}`)} className="icon" alt="Edit" />
                        <img src={deleteIcon} onClick={() => console.log(`Удаление мероприятия ${eventDetails.id}`)} className="icon" alt="Delete" />
                    </div>

                    <div className="event-details">
                        <h4>{t('events.description')}</h4>
                        <div dangerouslySetInnerHTML={{ __html: eventDetails.description || '' }} />
                        <img className="event-picture" src={getImageUrl()}></img>
                        <hr />
                        <div key={id}>
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        {/* {t('profile.education.studyYears')} */}
                                        Тип мероприятия
                                    </span>
                                    <span className="block-value">{eventDetails.type}</span>
                                </div>
                                <div className="block-row2">
                                    <span className="block-label">
                                        Целевая аудитория
                                    </span>
                                    <span className="block-value">{eventDetails.auditory}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        Дата(ы) проведения
                                    </span>
                                    <span className="block-value">{formatDate(eventDetails.dateTimeFrom)} - {formatDate(eventDetails.dateTimeTo)}</span>
                                </div>
                                <div className="block-row2">
                                    <span className="block-label">
                                        Формат мероприятия
                                    </span>
                                    <span className="block-value">{eventDetails.format}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        Ссылка
                                    </span>
                                    <span className="block-value">{eventDetails.link}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        Включать мероприятие в дайджест
                                    </span>
                                    <span className="block-value">{eventDetails.digestNeeded}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        Создал(а) мероприятие
                                    </span>
                                    <span className="block-value">{eventDetails.author?.firstName} {eventDetails.author?.lastName} {eventDetails.author?.patronymic}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        Необходима регистрация
                                    </span>
                                    <span className="block-value">{eventDetails.isRegistrationRequired}</span>
                                </div>
                                <div className="block-row2">
                                    <span className="block-label">
                                        Дата окончания регистрации
                                    </span>
                                    <span className="block-value">{formatDate(eventDetails.registrationLastDate)}</span>
                                </div>
                            </div>
                            <hr />
                        </div>
                        <GeoMap address={eventDetails.addressName ? eventDetails.addressName : ''} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEventDetailsPage;

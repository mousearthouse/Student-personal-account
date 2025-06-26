import './eventDetailsPage.scss';
import { getEventDetails } from '@/utils/api/requests/getEventDetails';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { API_URL } from '@/utils/constants/constants';
import GeoMap from '@/components/GeoMap/GeoMap';
import { formatDate } from '@/utils/usefulFunctions';
import { eventFormatMap } from '@/utils/constants/translations';
import { getEventIsParticipant } from '@/utils/api/requests/getEventIsParticipant';
import { is } from 'date-fns/locale';

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [isParticipating, setIsParticipating] = useState(false);
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
                const response = await getEventDetails({ params: { id } });
                setEventDetails(response.data);
            } catch (error) {
                console.error('Ошибка при получении деталей мероприятия:', error);
            }
        };

        const checkIfParticipating = async () => {
            if (!id) return;

            try {
                const response = await getEventIsParticipant({ params: { id } });
                if (response.status === 200) {
                    setIsParticipating(true);
                }
            } catch (error) {
                console.error('Ошибка при получении деталей мероприятия:', error);
            }
        };

        fetchEventDetails();
        checkIfParticipating();
    }, [id]);

    console.log(eventDetails);

    return (
        <div className="events-page">
            <div className="events-page-content">
                <div>
                    <h1>{t('event.pageName')}</h1>
                </div>
                <span className="page-link" onClick={() => navigate('/')}>
                    Главная /
                </span>
                <span className="page-link-blue"> {eventDetails.title}</span>
                <div>
                    <div className="event-name-details">
                        <h2>{eventDetails.title}</h2>
                        {eventDetails.isRegistrationRequired && !isParticipating &&
                            <button>БУДУ УЧАСТВОВАТЬ</button>
                        }
                        {eventDetails.isRegistrationRequired && isParticipating &&
                            <button disabled className="btn-active">УЧАСТВУЮ</button>
                        }
                    </div>

                    <div className="event-details">
                        <details>
                            <summary className="event-details-summary">
                                <h4>{t('events.description')}</h4>
                            </summary>
                            <div className="event-description">
                                <div dangerouslySetInnerHTML={{ __html: eventDetails.description || '' }} />
                                <img className="event-picture" src={getImageUrl()} alt="Event" />
                                <hr />
                                <div key={id}>
                                    {eventDetails.isRegistrationRequired && 
                                    <>
                                        <div className="container-row">
                                            <div className="block-row1">
                                                <span className="block-label">
                                                    {t('events.lastDateRegistration')}
                                                </span>
                                                <span className="block-value">{formatDate(eventDetails.registrationLastDate)}</span>
                                            </div>
                                        </div>
                                        <hr />
                                    </>}
                                    <div className="container-row">
                                        <div className="block-row1">
                                            <span className="block-label">
                                                {t('events.dates')}
                                            </span>
                                            <span className="block-value">{formatDate(eventDetails.dateTimeFrom)} - {formatDate(eventDetails.dateTimeTo)}</span>
                                        </div>
                                        <div className="block-row2">
                                            <span className="block-label">
                                                {t('events.format')}
                                            </span>
                                            <span className="block-value">{eventDetails.format && eventFormatMap[eventDetails.format]}</span>
                                        </div>
                                    </div>
                                    
                                    {eventDetails.format == 'Offline' &&
                                    <>
                                        <hr />
                                        <div className="container-row">
                                            <div className="block-row1">
                                                <span className="block-label">
                                                    {t('events.address')}
                                                </span>
                                                <span className="block-value">{eventDetails.addressName}</span>
                                            </div>

                                            <div className="block-row2">
                                                <GeoMap address={eventDetails.addressName || ''} />
                                            </div>
                                        </div></>
                                    }
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;

import './eventDetailsPage.scss'
import { getEventDetails } from '@/utils/api/requests/getEventDetails';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Translation, useTranslation } from "react-i18next";
import { API_URL } from '@/utils/constants/constants';

const EventDetailsPage = () => {

    const { id } = useParams<{ id: string }>();
    const [eventDetails, setEventDetails] = useState({} as EventDto);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getImageUrl = () => {
        if (eventDetails.picture) {
            return `${API_URL}Files/${eventDetails.picture.id}`;
        }
        return "src/assets/react.svg";
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

        fetchEventDetails();
    }, [id]);

    console.log(eventDetails);
    
    return (
        <div className="events-page">
            <div className="events-page-content">
                <div>
                    <h1>Мероприятия</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>Главная /</span>
                <span className='page-link-blue'> {eventDetails.title}</span>
                <div>
                    <div className='event-name'>
                        <h2>{eventDetails.title}</h2>
                        <button>БУДУ УЧАСТВОВАТЬ</button>
                    </div>
                    
                    <div className='event-details'>
                        <h4>{t('events.description')}</h4>
                        <div dangerouslySetInnerHTML={{ __html: eventDetails.description || '' }} />
                        <img className='event-picture' src={getImageUrl()}></img>
                        <hr/>
                        <div key={id}>
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">{t('profile.education.studyYears')}</span>
                                    <span className="block-value">{}</span>
                                </div>
                                <div className="block-row2">
                                    <span className="block-label">{t('profile.education.recordBookNumber')}</span>
                                    <span className="block-value">{}</span>
                                </div>
                            </div>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventDetailsPage;
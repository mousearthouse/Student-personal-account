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
import Modal from '@/components/Modal/Modal';
import { postRegisterEventExternal } from '@/utils/api/requests/postRegisterEventExternal';
import toast from '@/components/Notification/toast';

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [isParticipating, setIsParticipating] = useState(false);
    const [eventDetails, setEventDetails] = useState({} as EventDto);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('userId');

    const [modalRegisterOpen, setModalRegisterOpen] = useState(false);

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
            if (localStorage.getItem('userId') == null) return;

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

    const innerRegister = () => {
        console.log("inner register");
    }

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
                        {eventDetails.isRegistrationRequired && !isParticipating && isAuthenticated &&
                            <button onClick={innerRegister}>БУДУ УЧАСТВОВАТЬ</button>
                        }
                        {eventDetails.isRegistrationRequired && isParticipating &&
                            <button disabled className="btn-active">УЧАСТВУЮ</button>
                        }
                        {eventDetails.isRegistrationRequired && !isAuthenticated &&
                            <button onClick={() => setModalRegisterOpen(true)}>БУДУ УЧАСТВОВАТЬ</button>
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
                <ModalRegister isOpen={modalRegisterOpen} onClose={() => setModalRegisterOpen(false)} eventId={eventDetails.id}/>
            </div>
        </div>
    );
};

interface ModalRegisterProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
}


const ModalRegister = ({isOpen, onClose, eventId}: ModalRegisterProps) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");

    const handleRegister = async () => {
        console.log('Создание мероприятия с данными:')

        try {
            const registerData = {
                eventId: eventId,
                name: name,
                phone: phone,
                email: email,
                additionalInfo: additionalInfo,
            };
            console.log(registerData)

            if (phone == "" && email == "") {
                toast.warning('Введите телефон или имейл');
                return;
            }

            const response = await postRegisterEventExternal(registerData);
            if (response.status === 200) {
                toast.success('Вы зарегистрировались на мероприятие! Запишите информацию о нем, чтобы не потерять');
                onClose();
            }

            console.log('Данные мероприятия:', registerData);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            toast.error('Что-то пошло не так. Может, вы уже зарегистрировались на мероприятие?');
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='modal-window'>
                <h2>Регистрация на мероприятие</h2>
                <div className='admin-page-content'>
                    <div className='admin-create-service'>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                ФИО
                            </label>
                            <input
                                id="name"
                                placeholder=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="phone">
                                Телефон
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                pattern="^\+?[0-9\s()-]+$"
                                placeholder="+7 (999) 999-99-99"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="type">
                                Дополнительная информация
                            </label>
                            <input
                                id="email"
                                placeholder=""
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                className="form-input admin name"
                            />
                        </div>
                    </div>
                </div>
                <div className="btns">
                    <button onClick={handleRegister}>Создать</button>
                    <button onClick={onClose}>Отменить</button>
                </div>
            </div>
        </Modal>
    );
}

export default EventDetailsPage;

import './adminPage.scss';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import deleteIcon from '@/assets/icons/delete.svg';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@/utils/constants/constants';
import { formatDate, getImageUrl, getStatusClass } from '@/utils/usefulFunctions';
import { eventFormatMap, eventTypeMap, statusMap } from '@/utils/constants/translations';
import { getEventDetailsAdmin } from '@/utils/api/requests/admin/getEventDetailsAdmin';
import GeoMap from '@/components/GeoMap/GeoMap';
import StatusSelect from '@/components/StatusSelect/StatusSelect';
import Modal from '@/components/Modal/Modal';
import { deleteEventAdmin } from '@/utils/api/requests/admin/deleteEventAdmin';
import image from '@/assets/icons/image-upload.svg';
import { handleUpload } from '@/utils/api/requests/postFile';
import { editEventAdmin } from '@/utils/api/requests/admin/editEventAdmin';
import { TextEditor } from '@/components/TextEditor/TextEditor';
import toast from '@/components/Notification/toast';

const AdminEventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [eventDetails, setEventDetails] = useState({} as EventDto);
    const [status, setStatus] = useState<EventStatus>(eventDetails.status);
    const [allParticipants, setAllParticipants] = useState<EventParticipantDto[]>([]);
    const [participants, setParticipants] = useState<EventParticipantDto[]>();
    const [tab, setTab] = useState<0 | 1>(0);

    const [isModalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [isModalEditOpen, setModalEditOpen] = useState(false);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const getImageUrl = () => {
        if (eventDetails.picture) {
            return `${API_URL}Files/${eventDetails.picture.id}`;
        }
        return 'src/assets/react.svg';
    };

    useEffect(() => {
        if (eventDetails.status) {
            setStatus(eventDetails.status);
        }
    }, [eventDetails.status]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            try {
                const response = await getEventDetailsAdmin({ params: { id } });
                setEventDetails(response.data);
                setAllParticipants(response.data.participants ?? []);
            } catch (error) {
                console.error('Ошибка при получении деталей мероприятия:', error);
            }
        };

        fetchEventDetails();
    }, [id]);

    console.log(eventDetails);

    useEffect(() => {
        if (tab === 0) {
            setParticipants(allParticipants.filter(p => p.participantType === "Inner"));
        } else {
            setParticipants(allParticipants.filter(p => p.participantType === "External"));
        }
    }, [tab, allParticipants]);

    const onSelectTab = (tab: 0 | 1) => {
        setTab(tab);
    };

    const deleteEvent = async () => {
        try {
            const response = await deleteEventAdmin({ params: { id: eventDetails.id } });
            navigate('/admin/events');
        } catch (error) {
            console.error("oh NOOOOOO")
        }
    }
    
    return (
        <div className="events-page">
            <div className="events-page-content">
                <div>
                    <h1>{t("pages.events")}</h1>
                </div>
                <span className="page-link" onClick={() => navigate('/')}>{t("pages.main")} / </span>
                <span className="page-link" onClick={() => navigate('/admin')}>{t("pages.admin")} / </span>
                <span className="page-link" onClick={() => navigate('/admin/events')}>{t("pages.events")} / </span>
                <span className="page-link-blue"> {eventDetails.title}</span>
                <div>
                    <div className="event-name">
                        <h2>{eventDetails.title}</h2>
                        <div className='admin-icons'>
                            <div className='select-status'>
                                <StatusSelect value={status} onChange={setStatus} eventId={eventDetails.id} />
                            </div>
                            <img src={editIcon} onClick={() => setModalEditOpen(true)} className="icon" alt="Edit" />
                            <img src={deleteIcon} onClick={() => setModalDeleteOpen(true)}
                            className="icon" alt="Delete" />
                        </div>
                    </div>

                    <div className="event-details">
                        <h4>{t('events.description')}</h4>
                        <div dangerouslySetInnerHTML={{ __html: eventDetails.description || '' }} />
                        {eventDetails.picture && 
                            <img className="event-picture" src={getImageUrl()}></img>
                        }
                        <hr />
                        <div key={id} className="event-admin-info">
                             <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        {t("events.registrationNeeded")}
                                    </span>
                                    <span className="block-value">{eventDetails.isRegistrationRequired}</span>
                                </div>
                                <div className="block-row2">
                                    <span className="block-label">
                                        {t("events.lastDateRegistration")}
                                    </span>
                                    <span className="block-value">{formatDate(eventDetails.registrationLastDate)}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="container-row">
                                <div className='block-row1'>
                                    <div className="container-row admin">
                                        <div className="block-row1">
                                            <span className="block-label">
                                                {t("events.type")}
                                            </span>
                                            <span className="block-value">{eventTypeMap[eventDetails.type]}</span>
                                        </div>
                                        <div className="block-row2">
                                            <span className="block-label">
                                                {t("events.audience")}
                                            </span>
                                            <span className="block-value">{eventDetails.auditory}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="container-row admin">
                                        <div className="block-row1">
                                            <span className="block-label">
                                                {t("events.dates")}
                                            </span>
                                            <span className="block-value">{formatDate(eventDetails.dateTimeFrom)} - {formatDate(eventDetails.dateTimeTo)}</span>
                                        </div>
                                        <div className="block-row2">
                                            <span className="block-label">
                                                {t("events.format")}
                                            </span>
                                            <span className="block-value">{eventFormatMap[eventDetails.format]}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    {/* <div className="container-row admin">
                                        <div className="block-row1">
                                            <span className="block-label">
                                                Долгота
                                            </span>
                                            <span className="block-value">{eventDetails.longitude}</span>
                                        </div>
                                        <div className="block-row2">
                                            <span className="block-label">
                                                Широта
                                            </span>
                                            <span className="block-value">{eventDetails.latitude}</span>
                                        </div>
                                    </div>
                                    <hr /> */}
                                </div>
                                <div className='block-row2'>
                                    <GeoMap address={eventDetails.addressName ? eventDetails.addressName : ''}/>
                                </div>
                            </div>
                            {eventDetails.link &&
                            <>
                                <div className="container-row">
                                    <div className="block-row1">
                                        <span className="block-label">
                                            {t("events.link")}
                                        </span>
                                        <span className="block-value">{eventDetails.link}</span>
                                    </div>
                                </div>
                                <hr />
                            </>
                            }
                            {eventDetails.isDigestNeeded &&
                            <>
                                <div className="container-row">
                                    <div className="block-row1">
                                        <span className="block-label">
                                            {t("events.digestNeeded")}
                                        </span>
                                        <span className="block-value">{eventDetails.isDigestNeeded ? "Да" : "Нет"}</span>
                                    </div>
                                </div>
                                <hr />
                            </>}
                            {eventDetails.digestText &&
                            <>
                                <div className="container-row">
                                    <div className="block-row1">
                                        <span className="block-label">
                                            Текст дайджеста
                                        </span>
                                        <div dangerouslySetInnerHTML={{ __html: eventDetails.digestText || '' }}></div>
                                        
                                    </div>
                                </div>
                                <hr />
                            </>}
                            
                            <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        {t("events.madeEvent")}
                                    </span>
                                    <span className="block-value">{eventDetails.author?.firstName} {eventDetails.author?.lastName} {eventDetails.author?.patronymic}</span>
                                </div>
                            </div>
                        </div>
                        <ParticipantsList participants={participants} selectedTab={tab} onSelect={onSelectTab} />
                        <Modal isOpen={isModalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
                            <div className='modal-window'>
                                <h2>Вы точно хотите удалить данное мероприятие?</h2>
                                <p>Вы точно-точно уверены?</p>
                                <button onClick={deleteEvent}>Да, удалить</button>
                            </div>
                        </Modal>
                        <ModalEdit eventData={eventDetails} isOpen={isModalEditOpen} onClose={() => setModalEditOpen(false)}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ModalEditProps {
    eventData: EventDto;
    isOpen: boolean;
    onClose: () => void;
}

const ModalEdit = ({eventData, isOpen, onClose}: ModalEditProps) => {
    const [eventName, setEventName] = useState<string | undefined>(eventData.title);
    const [status, setStatus] = useState(eventData.status);
    const [format, setFormat] = useState<EventFormat>(eventData.format);
    const [type, setType] = useState<EventType | "">(eventData.type);
    const [auditory, setAuditory] = useState<EventAuditory>(eventData.auditory);
    const [eventStartDate, setEventStartDate] = useState(eventData.dateTimeFrom);
    const [eventEndDate, setEventEndDate] = useState(eventData.dateTimeTo);

    const [registration, setRegistration] = useState(false);
    const [registrationLastDate, setRegistrationLastDate] = useState(eventData.registrationLastDate);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState("");

    const [descValue, setDescValue] = useState(eventData.description);
    const [linkValue, setLinkValue] = useState(eventData.link);
    const [notification, setNotification] = useState(eventData.notificationText);
    const [digest, setDigest] = useState(eventData.digestText);
    const [digestNeeded, setDigestNeeded] = useState(false);

    const [timeForStart, setTimeForStart] = useState(false);
    const [timeForEnd, setTimeForEnd] = useState(false);
    
    const [address, setAddressValue] = useState("");

    const dateFormat = (date?: string) => {
        if (date == null || date == undefined) return undefined;
        return new Date(date).toISOString().split('T')[0] 
    };

    useEffect(() => {
        setEventName(eventData.title);
        setStatus(eventData.status);
        setFormat(eventData.format);
        setType(eventData.type || "");
        setAuditory(eventData.auditory);
        setEventStartDate(dateFormat(eventData.dateTimeFrom));
        setEventEndDate(dateFormat(eventData.dateTimeTo));
        setRegistrationLastDate(dateFormat(eventData.registrationLastDate))
        setRegistration(!!eventData.isRegistrationRequired);
        setDescValue(eventData.description);
        setLinkValue(eventData.link);
        setNotification(eventData.notificationText);
        setDigest(eventData.digestText);
        setFileId(eventData.picture ? eventData.picture.id : "");
    }, [eventData]);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedFile(file);
                const result = await handleUpload(file);
                if (result?.status === 200) {
                    setFileId(result.data.id);
                    console.log('Файл успешно загружен:', result.data.id);
                    toast.success("Файл успешно загружен!")
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            toast.error("Что-то пошло не так...")
        }
    };
    
    const handleEdit = async () => {
        console.log('Создание мероприятия с данными:')

        console.log({eventName,descValue,digest,dateTimeFrom: eventStartDate ? new Date(eventStartDate).toISOString() : "",
            dateTimeTo: eventEndDate ? new Date(eventEndDate).toISOString() : "",type,status,format,linkValue,
            notification,fileId,registration,auditory});
        try {
            if (!type) {
                console.log("выбрать тип меро")
                return;
            }
            const eventEditData = {
                id: eventData.id,
                title: eventName,
                description: descValue,
                digestText: digest,
                isTimeFromNeeded: false,
                isTimeToNeeded: false,
                dateTimeFrom: eventStartDate ? new Date(eventStartDate).toISOString() : "",
                dateTimeTo: eventEndDate ? new Date(eventEndDate).toISOString() : "",
                registrationLastDate: registrationLastDate ? new Date(registrationLastDate).toISOString() : undefined,
                type: type as EventType,
                status: status,
                format: format as EventFormat,
                link: linkValue,
                notification: notification,
                pictureId: fileId ? fileId : undefined,
                addressName: "",
                latitude: 0,
                longitude: 0,
                isRegistrationRequired: registration,
                isDigestNeeded: digestNeeded ? true : false,
                notificationText: notification,
                auditory: auditory,
            };

            const response = await editEventAdmin(eventEditData);
            if (response.status === 200) {
                toast.success("Данные мероприятия успешно изменены!")
                onClose();
            }

            console.log('Данные мероприятия:', eventEditData);
        } catch (error) {
            console.error('Ошибка при редактировании мероприятия:', error);
            toast.error("Что-то пошло не так...")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='modal-window'>
                <h2>Редактирование мероприятия</h2>
                <p>Вы точно-точно уверены?</p>
            </div>
            <div className='admin-page-content'>
                <div className='admin-create-event'>
                    <div className="input-form-w-label">
                        <label className="label-form" htmlFor="name">
                            Название мероприятия
                        </label>
                        <input
                            id="name"
                            placeholder=""
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="form-input admin name"
                        />
                    </div>
                    <h4>Описание мероприятия</h4>
                    <TextEditor value={descValue ?? ''} setValue={setDescValue}/>

                    <div className="input-forms-other">
                        <div className="date-time">
                            <div className="input-form-w-label admin">
                                <label className="label-form" htmlFor="name">
                                    Дата начала
                                </label>
                                <input
                                    type={timeForStart ? "datetime-local" : "date"}
                                    id="name"
                                    placeholder=""
                                    value={eventStartDate}
                                    onChange={(e) => setEventStartDate(e.target.value)}
                                    className="form-input admin date"
                                />
                            </div>
                            <div className="time-switch">
                                <label className='switch-label'>
                                    Время
                                </label>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={timeForStart}
                                        onChange={() => setTimeForStart(!timeForStart)}
                                        className="checkbox"
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            
                        </div>
                        <div className="date-time">
                            <div className="input-form-w-label admin">
                                <label className="label-form" htmlFor="name">
                                    Дата окончания
                                </label>
                                <input
                                    type={timeForEnd ? "datetime-local" : "date"}
                                    id="name"
                                    placeholder=""
                                    value={eventEndDate}
                                    onChange={(e) => setEventEndDate(e.target.value)}
                                    className="form-input admin date"
                                />
                            </div>
                            <div className="time-switch">
                                <label className='switch-label'>
                                    Время
                                </label>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={timeForEnd}
                                        onChange={() => setTimeForEnd(!timeForEnd)}
                                        className="checkbox"
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div className="input-form-w-label">
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value as EventType)}
                                className="form-input admin"
                            >
                                <option value="">Выберите тип</option>
                                <option value="Open">Открытое</option>
                                <option value="Close">Закрытое</option>
                            </select>
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="status">
                                Целевая аудитория
                            </label>
                            <select
                                id="status"
                                value={auditory}
                                onChange={(e) => setAuditory(e.target.value as EventAuditory)}
                                className="form-input admin"
                            >
                                <option value="">Все</option>
                                <option value="Students">Студенты</option>
                                <option value="Employees">Сотрудники</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-switch">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={registration}
                                onChange={() => setRegistration(!registration)}
                                className="checkbox"
                            />
                            <span className="slider"></span>
                        </label>
                        <label className='switch-label'>
                            Необходима регистрация
                        </label>
                    </div>
                    {registration &&
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Дата окончания регистрации
                            </label>
                            <input
                                type="date"
                                id="name"
                                placeholder=""
                                value={registrationLastDate}
                                onChange={(e) => setRegistrationLastDate(e.target.value)}
                                className="form-input admin date"
                            />
                        </div>
                    }
                    <div className="input-form-w-label">
                        <label className="label-form" htmlFor="format">
                            Формат мероприятия
                        </label>
                        <select
                            id="format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value as EventFormat)}
                            className="form-input admin"
                        >
                            <option value="">Все</option>
                            <option value="Online">Онлайн</option>
                            <option value="Offline">Офлайн</option>
                        </select>
                    </div>
                    {format == 'Online' && 
                    <div className="input-form-w-label">
                        <label className="label-form" htmlFor="name">
                            Ссылка
                        </label>
                        <input
                            id="name"
                            placeholder=""
                            value={linkValue}
                            onChange={(e) => setLinkValue(e.target.value)}
                            className="form-input admin name"
                        />
                    </div>
                    }
                    {format == 'Offline' && 
                    <div className="input-form-w-label">
                        <label className="label-form" htmlFor="link">
                            Адрес
                        </label>
                        <input
                            id="link"
                            placeholder=""
                            value={address}
                            onChange={(e) => setAddressValue(e.target.value)}
                            className="form-input admin"
                        />
                    </div>
                    }
                    <h4>Уведомление о мероприятии</h4>
                    <TextEditor value={notification ?? ''} setValue={setNotification}/>
                    <div>
                        <h4>Включать мероприятие в дайджест</h4>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={digestNeeded}
                                onChange={() => setDigestNeeded(!digestNeeded)}
                                className="checkbox"
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    {digestNeeded && 
                        <TextEditor value={digest ?? ''} setValue={setDigest}/>
                    }

                    <label className="image-upload">
                        <img src={image} alt="Загрузить картинку" />
                        <span>Загрузить картинку</span>
                        <input type="file" accept="image/*" onChange={handleFileChange}/>
                    </label>
                    {selectedFile && (
                        <p className="uploaded-file-name">Вы выбрали: {selectedFile.name}</p>
                    )}
                    <div className="btns">
                        <button onClick={handleEdit}>СОХРАНИТЬ</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

interface ParticipantsListProps {
    participants?: EventParticipantDto[];
    selectedTab: 0 | 1 | null;
    onSelect: (tab: 0 | 1) => void;
}

const ParticipantsList = ({ participants, selectedTab, onSelect }: ParticipantsListProps) => {
    const { t } = useTranslation();
    return (
        <div className='participants-list'>
            <div className="tabs">
            <div className="tab-buttons">
                <button
                    className={`tab-button ${selectedTab === 0 ? 'active' : ''}`}
                    onClick={() => onSelect(0)}
                >
                    <div className="tab-title">{t("events.innerParticipants")}</div>
                </button>
                <button
                    className={`tab-button ${selectedTab === 1 ? 'active' : ''}`}
                    onClick={() => onSelect(1)}
                >
                    <div className="tab-title">{t("events.externalParticipants")}</div>

                </button>

            </div>
            <div className='participants'>
                {participants?.map((participant) => {
                    if (selectedTab === 0) {
                        return (
                            <div key={participant.id} className='participant-card'>
                                <img src={getImageUrl(participant.user?.avatar.id)} alt={t('profile.avatarAlt')}/>
                                <div>
                                    <p>{participant.user?.firstName} {participant.user?.lastName} {participant.user?.patronymic}</p>
                                    <span>{participant.email}</span>
                                </div>
                            </div>
                        );
                    } else if (selectedTab === 1) {
                        return (
                            <div key={participant.id} className='participant-card external'>
                                    {participant.name &&
                                        <p>{participant.name}</p>}
                                    <span>{participant.email}</span>
                                    <span>{participant.phone}</span>
                                    <span>Дополнительная информация</span>
                                    <span className='span-text'>{participant.additionalInfo}</span>
                                    <hr/>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    </div>
    )
};

export default AdminEventDetailsPage;

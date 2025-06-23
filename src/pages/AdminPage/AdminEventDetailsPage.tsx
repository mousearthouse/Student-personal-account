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
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';  
import GeoMap from '@/components/GeoMap/GeoMap';
import Select, { StylesConfig, SingleValue, ActionMeta } from "react-select";
import { editEventStatus } from '@/utils/api/requests/admin/editEventStatus';

type EventStatus = "Draft" | "Actual" | "Finished" | "Archive";

interface StatusOption {
  value: EventStatus;
  label: string;
  color: string;
}

const statusOptions: StatusOption[] = [
  { value: "Draft", label: "Черновик", color: "#aaa" },
  { value: "Actual", label: "Опубликовано", color: "#32c550" },
  { value: "Finished", label: "Завершено", color: "#555" },
  { value: "Archive", label: "Архивировано", color: "#333" },
];

const customStyles: StylesConfig<StatusOption> = {
    control: (base) => ({
        ...base,
        borderRadius: "0.5rem",
        padding: "0.2rem",
        minHeight: "40px",
        minWidth: "100%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    }),
    singleValue: (base, { data }) => ({
        ...base,
        color: "#fff",
        background: data.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "0.5rem",
        display: "inline-block",
    }),
    option: (base, { isFocused, data }) => ({
        ...base,
        background: isFocused ? data.color : "white",
        color: isFocused ? "white" : data.color,
        cursor: "pointer",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "0.5rem",
        overflow: "hidden",
    }),
};

interface MyStatusSelectProps {
  value: EventStatus;
  onChange: (status: EventStatus) => void;
  eventId: string;
}

export const MyStatusSelect = ({ value, onChange, eventId }: MyStatusSelectProps) => {
    const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);

    useEffect(() => {
        if (value) {
        const newSelected = statusOptions.find(option => option.value === value) || null;
        setSelectedStatus(newSelected);
        }
    }, [value]);
    if (!value) {
        return <div>Загрузка статуса...</div>;
    }
        
  const handleStatusChange = async (
    newValue: SingleValue<StatusOption>,
    actionMeta: ActionMeta<StatusOption>
    ) => {
        if (!newValue || Array.isArray(newValue)) return;
        const newStatus = newValue.value;
        
        setSelectedStatus(newValue);

        onChange(newStatus);

        try {
            const response = await editEventStatus({ id: eventId, newStatus });
        } catch (error) {
            console.error('Ошибка при изменении статуса мероприятия:', error);
        }
    };

  return (
    <Select
      isMulti={false}
      value={selectedStatus}
      onChange={handleStatusChange}
      options={statusOptions}
      styles={customStyles}
      isSearchable={false}
    />
  );
};

const AdminEventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [eventDetails, setEventDetails] = useState({} as EventDto);
    const [status, setStatus] = useState<EventStatus>(eventDetails.status);
    const [allParticipants, setAllParticipants] = useState<EventParticipantDto[]>([]);
    const [participants, setParticipants] = useState<EventParticipantDto[]>();
    const [tab, setTab] = useState<0 | 1>(0)
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
                const innerParticipants = (participants ?? []).filter(p => p.participantType == 'Inner');
                const externalParticipants = (participants ?? []).filter(p => p.participantType == 'External');
                console.log("отправляется статус ", response.data.status)
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
    }, [tab, allParticipants]);  // зависим от вкладки и полного списка

        // обработчик смены вкладки теперь просто меняет tab
    const onSelectTab = (tab: 0 | 1) => {
        setTab(tab);
    };
    

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
                        <div className='admin-icons'>
                            <div className='select-status'>
                                <MyStatusSelect value={status} onChange={setStatus} eventId={eventDetails.id} />
                            </div>
                            <img src={editIcon} onClick={() => console.log(`Редактирование мероприятия ${eventDetails.id}`)} className="icon" alt="Edit" />
                            <img src={deleteIcon} onClick={() => console.log(`Удаление мероприятия ${eventDetails.id}`)} className="icon" alt="Delete" />
                        </div>
                    </div>

                    <div className="event-details">
                        <h4>{t('events.description')}</h4>
                        <div dangerouslySetInnerHTML={{ __html: eventDetails.description || '' }} />
                        <img className="event-picture" src={getImageUrl()}></img>
                        <hr />
                        <div key={id} className="event-admin-info">
                             <div className="container-row">
                                <div className="block-row1">
                                    <span className="block-label">
                                        {/* {t('profile.education.studyYears')} */}
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
                            <div className="container-row">
                                <div className='block-row1'>
                                    <div className="container-row admin">
                                        <div className="block-row1">
                                            <span className="block-label">
                                                {/* {t('profile.education.studyYears')} */}
                                                Тип мероприятия
                                            </span>
                                            <span className="block-value">{eventTypeMap[eventDetails.type]}</span>
                                        </div>
                                        <div className="block-row2">
                                            <span className="block-label">
                                                Целевая аудитория
                                            </span>
                                            <span className="block-value">{eventDetails.auditory}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="container-row admin">
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
                                            <span className="block-value">{eventFormatMap[eventDetails.format]}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="container-row admin">
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
                                    <hr />
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
                                            Ссылка
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
                                            Включать мероприятие в дайджест
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
                                        Создал(а) мероприятие
                                    </span>
                                    <span className="block-value">{eventDetails.author?.firstName} {eventDetails.author?.lastName} {eventDetails.author?.patronymic}</span>
                                </div>
                            </div>
                        </div>
                        <ParticipantsList participants={participants} selectedTab={tab} onSelect={onSelectTab} />
                    </div>
                </div>
            </div>
        </div>
    );
};

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
                    <div className="tab-title">Внутренние участники</div>
                </button>
                <button
                    className={`tab-button ${selectedTab === 1 ? 'active' : ''}`}
                    onClick={() => onSelect(1)}
                >
                    <div className="tab-title">Внешние участники</div>

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

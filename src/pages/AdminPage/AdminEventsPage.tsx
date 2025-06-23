import { getEventsAdmin } from "@/utils/api/requests/admin/getEventsAdmin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './adminPage.scss';
import { useTranslation } from "react-i18next";
import editIcon from '@/assets/icons/edit.svg';
import deleteIcon from '@/assets/icons/delete.svg';
import filtersIcon from '@/assets/icons/filters.svg';
import filtersActiveIcon from '@/assets/icons/filters-active.svg';
import { formatDate, getImageUrl, getStatusClass } from "@/utils/usefulFunctions";
import Pagination from "@/components/Pagination/Pagination";
import { statusMap, eventFormatMap, eventTypeMap } from "@/utils/constants/translations";

const AdminEventsPage = () => {

    const navigate = useNavigate();

    const [events, setEvents] = useState({} as EventShortDtoPagedListWithMetadata);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 2;


    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [status, setStatus] = useState('' as EventStatus);
    const [format, setFormat] = useState('' as EventFormat);
    const [type, setType] = useState('' as EventType);

    const fetchEvents = async () => {
        try {
            const response = await getEventsAdmin({
                params: {
                    name: eventName || undefined,
                    eventDate: eventDate ? new Date(eventDate) : undefined,
                    status: status || undefined,
                    format: format || undefined,
                    eventType: type || undefined,
                    page: pageNumber,
                    pageSize: pageSize,
                },
            });
            setEvents(response.data);
            console.log(response.data.metaData);
            setPageCount(response.data.metaData.pageCount);
        } catch (err) {
            console.log('Что-то пошло не так при получении списка ивентов :( ', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [pageNumber]);

    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>Администрирование</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>Администрирование / </span>
                <span className='page-link-blue'>Мероприятия</span>

                <SearchBar
                    eventName={eventName}
                    eventDate={eventDate}
                    status={status}
                    format={format}
                    type={type}
                    setStatus={setStatus}
                    setFormat={setFormat}
                    setType={setType}
                    setEventName={setEventName}
                    setEventDate={setEventDate}
                    onSearch={fetchEvents}
                />
                <div className="events-container-admin">
                    {(events.results ?? []).map((event) => (
                        <EventAdminCard event={event} key={event.id} />
                    ))}
                </div>
                <Pagination
                    currentPage={pageNumber}
                    pageCount={pageCount}
                    onPageChange={setPageNumber}
                />
            </div>
        </main>
    );
};

const SearchBar = ({
    eventName,
    status,
    format,
    eventDate,
    type,
    setStatus,
    setFormat,
    setType,
    setEventName,
    setEventDate,
    onSearch,
}: GetEventAdminProps) => {
    const [showFilters, setShowFilters] = useState(false);
    return (
        <div className="search-bar">
            <div className="admin-search-header">
                <h3>Панель поиска</h3>
                <button
                    className={`search-btn filters-toggle-btn${showFilters ? " btn-active" : ""}`}
                    onClick={() => setShowFilters((prev) => !prev)}
                >
                    Фильтры <img src={showFilters ? filtersActiveIcon : filtersIcon} />
                </button>
            </div>
            
            <div className='search-forms admin'>
                <div className="input-form-w-label">
                    <label className="label-form" htmlFor="name">
                        Название мероприятия
                    </label>
                    <input
                        id="name"
                        placeholder=""
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="form-input name"
                    />
                </div>
                <button className='search-btn' onClick={onSearch}>НАЙТИ</button>
            </div>
            {showFilters && (
            <div className="input-forms-other">
                <div className="input-form-w-label">
                    <label className="label-form" htmlFor="status">
                        Статус
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as EventStatus)}
                        className="form-input admin"
                    >
                        <option value="">Все</option>
                        <option value="Draft">Черновик</option>
                        <option value="Actual">Опубликовано</option>
                        <option value="Finished">Завершено</option>
                        <option value="Archive">Архивировано</option>
                    </select>
                </div>
                <div className="input-form-w-label">
                    <label className="label-form" htmlFor="format">
                        Формат
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
                <div className="input-form-w-label">
                    <label className="label-form" htmlFor="type">
                        Тип мероприятия
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value as EventType)}
                        className="form-input admin"
                    >
                        <option value="">Все</option>
                        <option value="Open">Открытое</option>
                        <option value="Close">Закрытое</option>
                    </select>
                </div>
                <div className="input-form-w-label">
                    <label className="label-form" htmlFor="name">
                        Дата проведения мероприятия
                    </label>
                    <input
                        type="date"
                        id="name"
                        placeholder=""
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="form-input admin date"
                    />
                </div>
            </div>
            )}
        </div>
    );
};

const EventAdminCard = ({ event }: { event: EventShortDto }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    return (
        <div className="event-admin-card" onClick={() => navigate(`/admin/events/${event.id}`)}>
            <div className="event-picture-container">
                <img src={getImageUrl(event.picture?.id)} className="event-picture-admin" alt="Аватар" />
            </div>
            <div className="event-info">
                <div className="event-short-info">
                    <div className="event-name">
                        <h4>{event.title}</h4>
                        <div className="admin-icons">
                            <img src={editIcon} onClick={() => console.log(`Редактирование мероприятия ${event.id}`)} className="icon" alt="Edit" />
                            <img src={deleteIcon} onClick={() => console.log(`Удаление мероприятия ${event.id}`)} className="icon" alt="Delete" />
                        </div>
                    </div>
                    <div className={"event-status " + getStatusClass(event.status)}>
                        <span>{statusMap[event.status] || event.status}</span>
                    </div>
                    
                </div>
                <div className="details-container">
                    <div className="container-row">
                        <div className="block-row1">
                            <span>{t('events.format')}</span>
                            <p>{eventFormatMap[event.format] || event.format}</p>
                        </div>
                        <div className="block-row2">
                            <span>{t('events.type')}</span>
                            <p>{eventTypeMap[event.type]}</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="container-row">
                        <div className="block-row1">
                            <span>{t('events.dates')}</span>
                            <p>{formatDate(event.dateTimeFrom)} - {formatDate(event.dateTimeTo)}</p>
                        </div>
                        <div className="block-row2">
                            <span>{t('events.format')}</span>
                            <p>{eventFormatMap[event.format] || event.format}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminEventsPage;

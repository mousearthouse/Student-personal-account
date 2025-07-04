import { getEventsAdmin } from "@/utils/api/requests/admin/getEventsAdmin";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const [events, setEvents] = useState({} as EventShortDtoPagedListWithMetadata);
    const [pageNumber, setPageNumber] = useState(Number(searchParams.get('page')) || 1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 2;


    const [eventName, setEventName] = useState(searchParams.get('name') || '');
    const [eventDate, setEventDate] = useState(searchParams.get('date') || '');
    const [status, setStatus] = useState(searchParams.get('status') as EventStatus || '');
    const [format, setFormat] = useState(searchParams.get('format') as EventFormat || '');
    const [type, setType] = useState(searchParams.get('type') as EventType || '');

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
    }, [pageNumber, eventName, eventDate, status, format, type]);

    useEffect(() => {
        const params = new URLSearchParams();

        if (eventName) params.set('name', eventName);
        if (eventDate) params.set('date', eventDate);
        if (status) params.set('status', status);
        if (format) params.set('format', format);
        if (type) params.set('type', type);
        params.set('page', pageNumber.toString());

        setSearchParams(params);
    }, [eventName, eventDate, status, format, type, pageNumber]);

    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>{t("pages.admin")}</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>{t("pages.main")} / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>{t("pages.admin")} / </span>
                <span className='page-link-blue'>{t("pages.events")}</span>

                <h2>{t("pages.events")}</h2>
                <button className="add-smth" onClick={() => navigate("/admin/events/create")}>{t("event.addEvent")} +</button>

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
    const { t } = useTranslation();

    return (
        <div className="search-bar">
            <div className="admin-search-header">
                <h3>{t("event.searchPanel")}</h3>
                <button
                    className={`search-btn filters-toggle-btn${showFilters ? " btn-active" : ""}`}
                    onClick={() => setShowFilters((prev) => !prev)}
                >
                    {t("event.filters")} <img src={showFilters ? filtersActiveIcon : filtersIcon} />
                </button>
            </div>
            
            <div className='search-forms admin'>
                <div className="input-form-w-label">
                    <label className="label-form" htmlFor="name">
                        {t("event.eventName")}
                    </label>
                    <input
                        id="name"
                        placeholder=""
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="form-input name"
                    />
                </div>
                <button className='search-btn' onClick={onSearch}>{t("event.searchBtn")}</button>
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

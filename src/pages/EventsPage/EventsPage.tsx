import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './eventsPage.scss';
import { getEventsList } from '@/utils/api/requests/getEventsList';
import { API_URL } from '@/utils/constants/constants';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/Pagination/Pagination';
import { formatDate } from '@/utils/usefulFunctions';

const EventsPage = () => {
    const [events, setEvents] = useState({} as EventShortDtoPagedListWithMetadata);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const pageSize = 4;

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');

    const fetchEvents = async () => {
        try {
            const response = await getEventsList({
                params: {
                    name: eventName || undefined,
                    eventDate: eventDate ? new Date(eventDate) : undefined,
                    page: pageNumber,
                    pageSize: pageSize,
                },
            });
            setEvents(response.data);
            console.log(response.data.metaData);
            setPageCount(response.data.metaData.pageCount);
            console.log(response.data);
        } catch (err) {
            console.log('Что-то пошло не так при получении списка ивентов :( ', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [pageNumber]);

    return (
        <div className="events-page">
            <div className="events-page-content">
                <div>
                    <h1>Мероприятия</h1>
                </div>
                <span className="page-link-blue"> Главная</span>
                <SearchBar
                    eventName={eventName}
                    eventDate={eventDate}
                    setEventName={setEventName}
                    setEventDate={setEventDate}
                    onSearch={fetchEvents}
                />
                <div className="events-container">
                    {(events.results ?? []).map((event) => (
                        <EventCard event={event} key={event.id} />
                    ))}
                </div>
            </div>
            <Pagination
                currentPage={pageNumber}
                pageCount={pageCount}
                onPageChange={setPageNumber}
            />
        </div>
    );
};

const SearchBar = ({
    eventName,
    eventDate,
    setEventName,
    setEventDate,
    onSearch,
}: GetEventProps) => {
    return (
        <div className="search-bar">
            <h3>Поиск</h3>
            <div className='search-forms'>
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
                        className="form-input"
                    />
                </div>
            </div>
        </div>
    );
};

const EventCard = ({ event }: { event: EventShortDto }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const getImageUrl = () => {
        if (event.picture) {
            return `${API_URL}Files/${event.picture.id}`;
        }
        return 'src/assets/react.svg';
    };

    return (
        <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
            <img src={getImageUrl()} alt="Аватар" />
            <div className="event-card-content">
                <h3>{event.title}</h3>
                <span>{t('events.dates')}</span>
                <p>{formatDate(event.dateTimeFrom)} - {formatDate(event.dateTimeTo)}</p>
                <span>{t('events.format')}</span>
                <p>{event.format}</p>
            </div>
        </div>
    );
};

export default EventsPage;

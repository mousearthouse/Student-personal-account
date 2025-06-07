import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './eventsPage.scss';
import { getEventsList } from '@/utils/api/requests/getEventsList';
import { API_URL } from '@/utils/constants/constants';
import { Translation, useTranslation } from 'react-i18next';

const EventsPage = () => {
    const [events, setEvents] = useState({} as EventShortDtoPagedListWithMetadata);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');

    const fetchEvents = async () => {
        try {
            const response = await getEventsList({
                params: {
                    name: eventName || undefined,
                    eventDate: eventDate ? new Date(eventDate) : undefined,
                },
            });
            setEvents(response.data);
            //setPageCount(response.data.metadata.pageCount);
            console.log(response.data);
        } catch (err) {
            console.log('Что-то пошло не так при получении списка ивентов :( ', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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
        </div>
    );
};

interface GetEventProps {
    eventName: string;
    eventDate: string;
    setEventName: (value: string) => void;
    setEventDate: (value: string) => void;
    onSearch: () => void;
}

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
            <div className="input-form-w-label">
                <label className="label-form" htmlFor="name">
                    Название мероприятия
                </label>
                <input
                    id="name"
                    placeholder=""
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="form-input"
                />
            </div>
            <button onClick={onSearch}>НАЙТИ</button>
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
    );
};

const EventCard = ({ event }: { event: EventShortDto }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const formatDateRange = (start?: string, end?: string) => {
        const startDate = start ? new Date(start) : new Date();
        const endDate = end ? new Date(end) : new Date();

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

        const formattedStart = `${dateFormatter.format(startDate)} (${timeFormatter.format(startDate)})`;
        const formattedEnd = `${dateFormatter.format(endDate)} (${timeFormatter.format(endDate)})`;

        return `${formattedStart} - ${formattedEnd}`;
    };

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
                <p>{formatDateRange(event.dateTimeFrom, event.dateTimeTo)}</p>
                <span>{t('events.format')}</span>
                <p>{event.format}</p>
            </div>
        </div>
    );

    //     "events": {
    //   "title": "Events",
    //   "home": "Home",
    //   "search": "Search",
    //   "searchPlaceholder": "Event name",
    //   "datePlaceholder": "Event date",
    //   "searchButton": "Search",
    //   "dates": "Event dates",
    //   "format": "Event format",
    //   "offline": "Offline",
    //   "online": "Online"
    // }
};

export default EventsPage;

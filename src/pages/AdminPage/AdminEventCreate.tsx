import { useState, useTransition } from "react";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import image from '@/assets/icons/image-upload.svg';
import { handleUpload } from "@/utils/api/requests/postFile";
import { postEvent } from "@/utils/api/requests/admin/postEvent";
import { TextEditor } from "@/components/TextEditor/TextEditor";
import toast from "@/components/Notification/toast"
import { useTranslation } from "react-i18next";

const AdminEventCreate = () => {
    const [eventName, setEventName] = useState("");
    const [status, setStatus] = useState("");
    const [format, setFormat] = useState<EventFormat>("Online");
    const [type, setType] = useState<EventType | "">("");
    const [auditory, setAuditory] = useState<EventAuditory>("All");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");

    const [registration, setRegistration] = useState(false);
    const [registrationLastDate, setRegistrationLastDate] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    const [descValue, setDescValue] = useState("");
    const [linkValue, setLinkValue] = useState("");
    const [notification, setNotification] = useState("");
    const [digestNeeded, setDigestNeeded] = useState(false);
    const [digest, setDigest] = useState("");

    const [timeForStart, setTimeForStart] = useState(false);
    const [timeForEnd, setTimeForEnd] = useState(false);

    const [address, setAddressValue] = useState("");

    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedFile(file);
                const result = await handleUpload(file);
                if (result?.status === 200) {
                    setFileId(result.data.id);
                    console.log('Файл успешно загружен:', result.data.id);
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };
    
    const handleCreate = async () => {
        console.log('Создание мероприятия с данными:')

        console.log({
            eventName,
            descValue,
            digest,
            dateTimeFrom: eventStartDate ? new Date(eventStartDate).toISOString() : "",
            dateTimeTo: eventEndDate ? new Date(eventEndDate).toISOString() : "",
            registrationLastDate: registrationLastDate ? new Date(registrationLastDate).toISOString() : "",
            type,
            status,
            format,
            linkValue,
            notification,
            fileId,
            registration,
            auditory
        });
        try {
            if (!type) {
                toast.warning('Выберите тип мероприятия');
                return;
            };
            if (!eventStartDate || !eventEndDate) {
                toast.warning('Выберите даты начала и окончания мероприятия');
                return;
            }

            if (format == 'Online' && !linkValue) {
                toast.warning('Для создания мероприятия с онлайн-форматом заполните поле "ссылка"');
                return;
            }

            if (registration == true && !registrationLastDate) {
                toast.warning('Для создания мероприятия с возможностью регистрации укажите последнюю дату регистрации');
                return;
            }
            
            const eventData = {
                title: eventName,
                description: descValue,
                digestText: digest,
                isTimeFromNeeded: false,
                isTimeToNeeded: false,
                dateTimeFrom: eventStartDate ? new Date(eventStartDate).toISOString() : "",
                dateTimeTo: eventEndDate ? new Date(eventEndDate).toISOString() : "",
                registrationLastDate: registrationLastDate ? new Date(registrationLastDate).toISOString() : null,
                type: type as EventType,
                status: status,
                format: format as EventFormat,
                link: linkValue,
                notification: notification,
                pictureId: fileId ?? null,
                addressName: address,
                latitude: 0,
                longitude: 0,
                isRegistrationRequired: registration,
                isDigestNeeded: digestNeeded,
                digest: digest,
                notificationText: notification,
                auditory: auditory,
            };

            const response = await postEvent(eventData);
            if (response.status === 200) {
                navigate('/admin/events');
                toast.success('Мероприятие успешно создано!');
            }
        } catch (error) {
            toast.error('Что-то пошло не так... Возможно, уже есть мероприятие с таким названием?');
            console.error('Ошибка при создании мероприятия:', error);
        }
    }

    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>{t("pages.admin")}</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>{t("pages.main")} / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>{t("pages.admin")} / </span>
                <span className='page-link' onClick={() => navigate('/admin/events')}>{t("pages.events")} / </span>
                <span className='page-link-blue'>{t("event.createEvent")}</span>
                <h2>{t("event.createEvent")}</h2>
                <div className='admin-create-event'>
                    <div className="input-form-w-label admin">
                        <label className="label-form" htmlFor="name">
                            {t("event.eventName")}
                        </label>
                        <input
                            id="name"
                            placeholder=""
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="form-input admin name"
                        />
                    </div>
                    <h4>{t("events.description")}</h4>
                    <TextEditor value={descValue} setValue={setDescValue}/>

                    <div className="input-forms-other">
                        <div className="date-time">
                            <div className="input-form-w-label admin">
                                <label className="label-form" htmlFor="name">
                                    {t("events.start-date")}
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
                                    {t("events.time")}
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
                                    {t("events.end-date")}
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
                                    {t("events.time")}
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
                        <div className="input-form-w-label admin">
                            <label className="label-form" htmlFor="type">
                                {t("events.type")}
                            </label>
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
                        <div className="input-form-w-label admin">
                            <label className="label-form" htmlFor="status">
                                {t("events.audience")}
                            </label>
                            <select
                                id="status"
                                value={auditory}
                                onChange={(e) => setAuditory(e.target.value as EventAuditory)}
                                className="form-input admin"
                            >
                                <option value="All">Все</option>
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
                            {t("events.registrationNeeded")}
                        </label>
                    </div>
                    {registration &&
                        <div className="input-form-w-label admin">
                            <label className="label-form" htmlFor="name">
                                {t("events.lastDateRegistration")}
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
                    
                    <div className="input-form-w-label admin">
                        <label className="label-form" htmlFor="format">
                            {t("events.format")}
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
                    <div className="input-form-w-label admin">
                        <label className="label-form" htmlFor="name">
                            {t("events.link")}
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
                    <div className="input-form-w-label admin">
                        <label className="label-form" htmlFor="link">
                            {t("events.address")}
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
                    
                    <h4>{t("events.notification")}</h4>
                    <TextEditor value={notification} setValue={setNotification}/>
                    <div>
                        <h4>{t("events.digestNeeded")}</h4>
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
                        <TextEditor value={digest} setValue={setDigest}/>
                    }
                   
                    <label className="image-upload">
                        <img src={image} alt="Загрузить картинку" />
                        <span>{t("events.uploadImage")}</span>
                        <input type="file" accept="image/*" onChange={handleFileChange}/>
                    </label>
                    {selectedFile && (
                        <p className="uploaded-file-name">Вы выбрали: {selectedFile.name}</p>
                    )}
                    <div className="btns">
                        <button onClick={handleCreate}>{t("events.save")}</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AdminEventCreate;
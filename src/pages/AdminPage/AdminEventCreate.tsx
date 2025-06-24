import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import image from '@/assets/icons/image-upload.svg';
import { handleUpload } from "@/utils/api/requests/postFile";
import { postEvent } from "@/utils/api/requests/admin/postEvent";
import { TextEditor } from "@/components/TextEditor/TextEditor";

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

    const [address, setAddressValue] = useState("");

    const navigate = useNavigate();

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
                console.log("выбрать тип меро")
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
            }

            console.log('Данные мероприятия:', eventData);
        } catch (error) {
            console.error('Ошибка при создании мероприятия:', error);
        }
    }

    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>Администрирование</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>Администрирование / </span>
                <span className='page-link' onClick={() => navigate('/admin/events')}>Мероприятия / </span>
                <span className='page-link-blue'>Создание мероприятия</span>
                <h2>Создание мероприятия</h2>
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
                    <TextEditor value={descValue} setValue={setDescValue}/>

                    <div className="input-forms-other">
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Дата начала
                            </label>
                            <input
                                type="date"
                                id="name"
                                placeholder=""
                                value={eventStartDate}
                                onChange={(e) => setEventStartDate(e.target.value)}
                                className="form-input admin date"
                            />
                        </div>
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Дата окончания
                            </label>
                            <input
                                type="date"
                                id="name"
                                placeholder=""
                                value={eventEndDate}
                                onChange={(e) => setEventEndDate(e.target.value)}
                                className="form-input admin date"
                            />
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
                    <TextEditor value={notification} setValue={setNotification}/>
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
                        <TextEditor value={digest} setValue={setDigest}/>
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
                        <button onClick={handleCreate}>СОХРАНИТЬ</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AdminEventCreate;
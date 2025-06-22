import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

const AdminEventCreate = () => {
    const [eventName, setEventName] = useState("");
    const [status, setStatus] = useState("");
    const [format, setFormat] = useState("");
    const [type, setType] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [registration, setRegistration] = useState(false);
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    
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
                            className="form-input name"
                        />
                    </div>
                    <h4>Описание мероприятия</h4>
                    <TextEditor value={value} setValue={setValue}/>

                    <div className="input-forms-other">
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Дата начала
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
                        <div className="input-form-w-label">
                            <label className="label-form" htmlFor="name">
                                Дата окончания
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
                            <label className="label-form" htmlFor="status">
                                Целевая аудитория
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as EventStatus)}
                                className="form-input admin"
                            >
                                <option value="">Все</option>
                                <option value="Student">Студенты</option>
                                <option value="Employee">Сотрудники</option>
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
                        
                        
                    </div>
                </div>
            </div>
        </main>
    );
}

const TextEditor = ({ value, setValue }: { value: string; setValue: (value: string) => void }) => {
    
    const modules = {
        toolbar: [
        [{ 'font': ['Roboto'] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['code-block'],
        ['clean']
        ],
    };
    
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
        />
    );
}

export default AdminEventCreate;
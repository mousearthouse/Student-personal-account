import { useNavigate } from 'react-router-dom';
import './adminPage.scss';

const AdminMainPage = () => {
    const navigate = useNavigate();

    return (
        <main>
            <div className="admin-page-content">
                <div>
                    <h1>Администрирование</h1>
                </div>
                <span className="page-link" onClick={() => navigate('/')}>Главная / </span>
                <span className="page-link-blue">Администрирование</span>
            </div>
            <div className="container admin-page">
                <div className="main-container first" onClick={() => navigate('/admin/users')}>
                    <p>Пользователи</p>
                    <span>
                        Каждый пользователь важен — мы стремимся сделать взаимодействие с платформой максимально простым и комфортным.
                    </span>
                </div>
                <div
                    className="main-container second"
                    onClick={() => navigate('/admin/usefulservices')}
                >
                    <p>Полезные сервисы</p>
                    <span>
                        Постоянное развитие технологий позволяет нам создавать удобные цифровые решения для поддержки вашей работы.
                    </span>
                </div>
                <div className="main-container third" onClick={() => navigate('/admin/events')}>
                    <p>Мероприятия</p>
                    <span>
                        Регулярная организация событий помогает делиться знаниями, расширять возможности и достигать новых вершин.
                    </span>
                </div>
            </div>
        </main>
    );
};

export default AdminMainPage;

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
                        Равным образом постоянный количественный рост и сфера нашей активности в
                        значительной степени обуславливает создание существенных финансовых и
                        административных условий. 
                    </span>
                </div>
                <div
                    className="main-container second"
                    onClick={() => navigate('/admin/usefulservices')}
                >
                    <p>Полезные сервисы</p>
                    <span>
                        Равным образом постоянный количественный рост и сфера нашей активности в
                        значительной степени обуславливает создание существенных финансовых и
                        административных условий. 
                    </span>
                </div>
                <div className="main-container third" onClick={() => navigate('/admin/events')}>
                    <p>Мероприятия</p>
                    <span>
                        Равным образом постоянный количественный рост и сфера нашей активности в
                        значительной степени обуславливает создание существенных финансовых и
                        административных условий. 
                    </span>
                </div>
            </div>
        </main>
    );
};

export default AdminMainPage;

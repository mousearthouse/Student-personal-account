import { useNavigate } from 'react-router-dom';
import './adminPage.scss';
import { useTranslation } from 'react-i18next';

const AdminMainPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <main>
            <div className="admin-page-content">
                <div>
                    <h1>{t("pages.admin")}</h1>
                </div>
                <span className="page-link" onClick={() => navigate('/')}>{t("pages.main")} / </span>
                <span className="page-link-blue">{t("pages.admin")}</span>
            </div>
            <div className="container admin-page">
                <div className="main-container first" onClick={() => navigate('/admin/users')}>
                    <p>{t("pages.users")}</p>
                    <span>
                        Каждый пользователь важен — мы стремимся сделать взаимодействие с платформой максимально простым и комфортным.
                    </span>
                </div>
                <div
                    className="main-container second"
                    onClick={() => navigate('/admin/usefulservices')}
                >
                    <p>{t("pages.usefulServices")}</p>
                    <span>
                        Постоянное развитие технологий позволяет нам создавать удобные цифровые решения для поддержки вашей работы.
                    </span>
                </div>
                <div className="main-container third" onClick={() => navigate('/admin/events')}>
                    <p>{t("pages.events")}</p>
                    <span>
                        Регулярная организация событий помогает делиться знаниями, расширять возможности и достигать новых вершин.
                    </span>
                </div>
            </div>
        </main>
    );
};

export default AdminMainPage;

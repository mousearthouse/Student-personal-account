import './adminPage.scss';
import { useNavigate } from "react-router-dom";

const AdminUsefulServicesPage = () => {
    const navigate = useNavigate();
    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>Администрирование</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>Администрирование / </span>
                <span className='page-link-blue'>Полезные сервисы</span>
                
                <div>
                    <h2>Полезные сервисы</h2>
                    <button>Добавить сервис</button>
                    <div className='services'>meow</div>
                </div>
                
            </div>
            
        </main>
    );
}

export default AdminUsefulServicesPage;

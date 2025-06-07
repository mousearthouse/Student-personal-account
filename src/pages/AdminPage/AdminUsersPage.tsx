import { useNavigate } from "react-router-dom";

const AdminUsersPage = () => {

  const navigate = useNavigate();
  return (
    <main>
            <div className='admin-page-content'>
                    <div>
                        <h1>Администрирование</h1>
                    </div>
                    <span className='page-link' onClick={() => navigate('/')}>Главная /</span>
                    <span className='page-link-blue'>Администрирование</span>
                    <span className='page-link-blue'>Администрирование</span>
            </div>
    </main>
  );
}

export default AdminUsersPage;
import { useNavigate } from "react-router-dom";
import './adminPage.scss';
import { getUsersList } from "@/utils/api/requests/admin/getUsersList";
import { useEffect, useState } from "react";
import { useValidDate } from "@/utils/usefulFunctions";
import Pagination from '@/components/Pagination/Pagination';

const AdminUsersPage = () => {

  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 6;
  const [users, setUsers] = useState<ProfileShortDto[]>([]);

  useEffect(() => {
    getUsersList({
      params: {
        email: '',
        name: '',
        filterLastName: '',
        page: pageNumber,
        pageSize: pageSize,
      }
    }).then(response => {
      console.log(response.data);
      setUsers(response.data.results);
      setPageCount(response.data.metaData.pageCount);
    }).catch(error => {
      console.error("Error fetching users list:", error);
    });
  }, [pageNumber]);

  return (
    <main>
      <div className='admin-page-content'>
        <div>
            <h1>Администрирование</h1>
        </div>
        <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
        <span className='page-link' onClick={() => navigate('/admin')}>Администрирование / </span>
        <span className='page-link-blue'>Пользователи</span>
        <div className="users-container">
          {users && (
            users.map((user) => (
              <ProfileCard profile={user} key={user.id} />
            ))
          )}
        </div>
      </div>
      <Pagination
        currentPage={pageNumber}
        pageCount={pageCount}
        onPageChange={setPageNumber}
      />
           
    </main>
  );
}

const ProfileCard = ({ profile }: { profile: ProfileShortDto }) => {
  const validDate = useValidDate();
  const navigate = useNavigate();

  return (
    <div key={profile.id} onClick={() => navigate(`/admin/users/${profile.id}`)} className="profile-admin-card">
      <p>{profile.firstName} {profile.lastName} {profile.patronymic}</p>
      <span>Дата рождения: {validDate(profile.birthDate)} </span> <br />
      <span>Email: {profile.email}</span>
      <hr />
    </div>
  )
}
export default AdminUsersPage;
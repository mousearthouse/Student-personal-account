import { useNavigate } from "react-router-dom";
import './adminPage.scss';
import { getUsersList } from "@/utils/api/requests/admin/getUsersList";
import { useEffect, useState } from "react";
import { useValidDate } from "@/utils/usefulFunctions";
import Pagination from '@/components/Pagination/Pagination';
import { useTranslation } from "react-i18next";

const AdminUsersPage = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const pageSize = 6;
  const [users, setUsers] = useState<ProfileShortDto[]>([]);

  const [name, setName] = useState("");

  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ'.split('');
  const [selectedLetter, setSelectedLetter] = useState('');

  const fetchUsers = () => {
    getUsersList({
      params: {
        email: '',
        name: name || '',
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
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNumber]);

  return (
    <main>
      <div className='admin-page-content'>
        <div>
            <h1>{t("pages.admin")}</h1>
        </div>
        <span className='page-link' onClick={() => navigate('/')}>{t("pages.main")} / </span>
        <span className='page-link' onClick={() => navigate('/admin')}>{t("pages.admin")} / </span>
        <span className='page-link-blue'>{t("pages.users")}</span>

        <div className="search-users">
          <div className="input-form-w-label admin">
            <input
                id="name"
                placeholder="Введите ФИО"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input admin name"
            />
          </div>
          <button className="search-users-btn" onClick={() => fetchUsers()}>{t("events.searchButton")}</button>
        </div>

        <div className="alphabet-filter">
          <button onClick={() => setSelectedLetter('')} className={!selectedLetter ? 'active' : ''}>
            Все
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={selectedLetter === letter ? 'active' : ''}
            >
              {letter}
            </button>
          ))}
        </div>
        
        <div className="users-container">
          {users &&
            users
              .filter((user) => {
                if (!selectedLetter) return true;
                const fullName = `${user.lastName} ${user.firstName} ${user.patronymic}`.toUpperCase();
                return fullName.startsWith(selectedLetter);
              })
              .map((user) => (
                <ProfileCard profile={user} key={user.id} />
              ))
          }
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
  const { t } = useTranslation();


  return (
    <div key={profile.id} onClick={() => navigate(`/admin/users/${profile.id}`)} className="profile-admin-card">
      <p>{profile.lastName} {profile.firstName} {profile.patronymic}</p>
      <span>{t("profile.birthDate")}: {validDate(profile.birthDate)} </span> <br />
      <span>Email: {profile.email}</span>
      <hr />
    </div>
  )
}
export default AdminUsersPage;
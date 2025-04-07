import './profilePage.scss';
import { getProfile } from '@/utils/api/requests/getProfile';
import { getStudent } from '@/utils/api/requests/getStudent';
import { API_URL } from '@/utils/constants';
import { useEffect, useState } from 'react';

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserProfileDto>({} as UserProfileDto);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                console.log(response.data);
                setUserData(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        fetchProfile();
    }, []);

    const getImageUrl = () => {
        return `${API_URL}Files/${userData.avatar.id}`;
    };

    return (
        <main>
            <div className='container'>
                <h1>Профиль</h1>
                <div className='user-data-block'>
                    <div className='avatar-container'>
                    {userData.avatar && (
                            <img src={getImageUrl()} alt="Аватар" />
                        )}
                    </div>
                    <PersonalData userData={userData} />
                    <Contacts userData={userData} />
                </div>
                <div className='education-info-block'>
                    <Education userData={userData} />
                </div>
            </div>
        </main>
    );
};

const PersonalData = ({ userData }: { userData: UserProfileDto }) => {
    return (
        <div className="block">
            <h3 className="block-title">Личные данные</h3>
            <div className="block-content">
                {userData.contacts && (
                    <div className="block-row">
                        <span className="block-label">Пол</span>
                        <span className="block-value">{userData.gender}</span>
                        <hr />
                    </div>
                )}
                {userData.birthDate && (
                    <div className="block-row">
                        <span className="block-label">Дата рождения</span>
                        <span className="block-value">{userData.birthDate}</span>
                        <hr />
                    </div>
                )}
                {userData.citizenship && (
                    <div className="block-row">
                        <span className="block-label">Гражданство</span>
                        <span className="block-value">{userData.citizenship.name}</span>
                        <hr />
                    </div>
                )}
                {userData.email && (
                    <div className="block-row">
                        <span className="block-label">Email</span>
                        <span className="block-value">{userData.email}</span>
                        <hr />
                    </div>
                )}
            </div>
        </div>
    );
}

const Contacts = ({ userData }: { userData: UserProfileDto }) => {

    return (
        <div className="block">
            <h3 className="block-title">Контакты</h3>
            <div className="block-content">
                {userData.contacts && (
                    <div className="block-row">
                        <span className="block-label">Телефон</span>
                        <span className="block-value">{}</span>
                        <hr />
                    </div>
                )}
                {userData.email && (
                    <div className="block-row">
                        <span className="block-label">Дополнительный E-mail:</span>
                        <span className="block-value">{userData.email}</span>
                        <hr />
                    </div>
                )}
        
                {userData.address && (
                    <div className="block-row">
                        <span className="block-label">Адрес</span>
                        <span className="block-value">{userData.address}</span>
                        <hr />
                    </div>
                )}
            </div>
        </div>
    );
};

const Education = ({ userData }: { userData: UserProfileDto }) => {
    const [studentData, setStudentData] = useState<StudentDto>({} as StudentDto);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getStudent();
                console.log(response.data);
                setStudentData(response.data);
            } catch (err) {
                console.log('Ошибка при входе. Проверьте введённые данные.');
            }
        };

        fetchProfile();
    }, []);
    return (
        <div className="block">
            <h3 className="block-title">Образование</h3>
            <h3 className='block-title'></h3>
            
            <div className="block-content">
                
            </div>
        </div>
    );
};

const Work = ({ userData }: { userData: UserProfileDto }) => {

};

export default ProfilePage;
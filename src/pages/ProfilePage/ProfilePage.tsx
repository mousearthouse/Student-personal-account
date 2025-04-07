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
                    <h2>{userData.lastName} {userData.firstName} {userData.patronymic}</h2>
                    <Education />
                </div>
            </div>
        </main>
    );
};

const PersonalData = ({ userData }: { userData: UserProfileDto }) => {
    return (
        <div className="block">
            <div className='block-row'>
                <h3>Личные данные</h3>
            </div>
            <div className="block-content">
                {userData.contacts && (
                    <div className="block-row">
                        <span className="block-label">Пол</span>
                        <span className="block-value">{userData.gender}</span>
                    </div>
                )}
                <hr />
                {userData.birthDate && (
                    <div className="block-row">
                        <span className="block-label">Дата рождения</span>
                        <span className="block-value">{userData.birthDate}</span>
                    </div>
                )}
                <hr />
                {userData.citizenship && (
                    <div className="block-row">
                        <span className="block-label">Гражданство</span>
                        <span className="block-value">{userData.citizenship.name}</span>
                    </div>
                )}
                <hr />
                {userData.email && (
                    <div className="block-row">
                        <span className="block-label">Email</span>
                        <span className="block-value">{userData.email}</span>
                    </div>
                )}
                <hr />
            </div>
        </div>
    );
}

const Contacts = ({ userData }: { userData: UserProfileDto }) => {

    return (
        <div className="block">
            <div className='block-row'>
                <h3>Контакты</h3>
            </div>
            <div className="block-content">
                {userData.contacts && (
                    <div className="block-row">
                        <span className="block-label">Телефон</span>
                        <span className="block-value">{}</span>
                    </div>
                )}
                <hr />
                {userData.email && (
                    <div className="block-row">
                        <span className="block-label">Дополнительный E-mail:</span>
                        <span className="block-value">{userData.email}</span>
                    </div>
                )}
                <hr />
                {userData.address && (
                    <div className="block-row">
                        <span className="block-label">Адрес</span>
                        <span className="block-value">{userData.address}</span>
                    </div>
                )}
                <hr />
            </div>
        </div>
    );
};

const Education = () => {
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

            {(studentData.educationEntries ?? []).map((educationEntry, id) => (
                <div key={id}>
                    <div className="container-row">
                        <div className='block-education-row1'>
                            <span className="block-label">Года обучения</span>
                            <span className="block-value">{educationEntry.educationYears.name}</span>
                        </div>
                        <div className='block-education-row2'>
                            <span className="block-label">Номер зачетной книги</span>
                            <span className="block-value">{educationEntry.creditBooknumber}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="container-row">
                        <div className='block-education-row1'>
                            <span className="block-label">Форма обучения</span>
                            <span className="block-value">{educationEntry.educationForm.name}</span>
                        </div>
                        <div className='block-education-row2'>
                            <span className="block-label">База</span>
                            <span className="block-value">{educationEntry.educationBase.name}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="container-row">
                        <div className='block-education-row1'>
                            <span className="block-label">Факультет</span>
                            <span className="block-value">{educationEntry.faculty.name}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="container-row">
                        <div className='block-education-row1'>
                            <span className="block-label">Направление</span>
                            <span className="block-value">{educationEntry.educationDirection.name}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="container-row">
                        <div>
                            <span className="block-label">Профиль</span>
                            <span className="block-value">{educationEntry.educationProfile.name}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="container-row">
                        <div className='block-education-row1'>
                            <span className="block-label">Курс</span>
                            <span className="block-value">{educationEntry.course}</span>
                        </div>
                        <div className='block-education-row2'>
                            <span className="block-label">Группа</span>
                            <span className="block-value">{educationEntry.group.name}</span>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="block-content">
                
            </div>
        </div>
    );
};

const Work = ({ userData }: { userData: UserProfileDto }) => {

};

export default ProfilePage;
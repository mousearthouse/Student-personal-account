import { getUserDetails } from "@/utils/api/requests/admin/getUserDetails";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl, useValidDate } from "@/utils/usefulFunctions";
import { useTranslation } from "react-i18next";

const AdminUserDetailsPage = () => {
    const navigate = useNavigate();
    const validDate = useValidDate();
    const { t } = useTranslation();
    const [user, setUser] = useState<ProfileDto | null>(null);

    useEffect(() => {
        const userId = window.location.pathname.split('/').pop();
        const getUser = async () => {
            if (userId) {
                try {
                const response = await getUserDetails({ params: { userId } });
                setUser(response.data);
                }
                catch(error) {
                    console.error("Error fetching user details:", error);
                };
            }
        }
        
        getUser();
    }, []);

    return (
        <main>
            <div className='admin-page-content'>
                <div>
                    <h1>Администрирование</h1>
                </div>
                <span className='page-link' onClick={() => navigate('/')}>Главная / </span>
                <span className='page-link' onClick={() => navigate('/admin')}>Администрирование / </span>
                <span className='page-link' onClick={() => navigate('/admin/users')}>Пользователи / </span>
                <span className='page-link-blue'>{user?.firstName} {user?.lastName} {user?.patronymic}</span>
                <h2>{user?.lastName} {user?.firstName} {user?.patronymic}</h2>
            </div>
            
            <div className="container">
                
                {user?.avatar && (
                    <div className="profile-avatar">
                        <img src={getImageUrl(user?.avatar.id)} />
                    </div>
                )}
                <div className="profile-info">
                    <div className="users-container">
                        <h4>Данные физического лица</h4>
                        <div>
                            <span>Пол</span>
                            <p>{user?.gender === 'NotDefined'
                            ? t('common.noData')
                            : t(`profile.genderTypes.${user?.gender.toLowerCase()}`)}
                            </p>
                        </div>
                        <hr />
                        <div>
                            <span>Дата рождения</span>
                            <p>{validDate(user?.birthDate)}</p>
                        </div>
                        <hr />
                        <div>
                            <span>Email</span>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="users-container">
                        <h4>Контакты</h4>
                        <div>
                            <span>Телефон</span>
                            <p>{user?.contacts?.find(contact => contact.type === 'Phone')?.value || t('common.noData')}</p>
                        </div>
                        <hr />
                        <div>
                            <span>Телефон 2</span>
                            <p>{user?.contacts?.find(contact => contact.type === 'Phone')?.value || t('common.noData')}</p>
                        </div>
                        <hr />
                        <div>
                            <span>Дополнительный Email</span>
                            <p>{user?.contacts?.find(contact => contact.type === 'Email')?.value || t('common.noData')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AdminUserDetailsPage;
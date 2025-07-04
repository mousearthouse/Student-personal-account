import { useEffect, useState } from 'react';
import './sidebarMenu.scss';
import openBtn from '@/assets/icons/sidebarMenu/openBtn.svg';
import profile from '@/assets/icons/sidebarMenu/profile.svg';
import admin from '@/assets/icons/sidebarMenu/admin.svg';
import certificates from '@/assets/icons/sidebarMenu/certificates.svg';
import usefulServices from '@/assets/icons/sidebarMenu/usefulServices.svg';
import events from '@/assets/icons/sidebarMenu/events.svg';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@/utils/constants/constants';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarMenu = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('userId'));
    const location = useLocation();

    const getImageUrl = () => {
        const avatar = localStorage.getItem('userAvatar');
        console.log(avatar);
        if (avatar) {
            return `${API_URL}Files/${avatar}`;
        }
        return 'src/assets/react.svg';
    };

    const logout = () => {
        localStorage.clear();
        navigate("login");
    }

    useEffect(() => {
        console.log("Переход по маршруту:", location.pathname);
        setIsLoggedIn(localStorage.getItem('userId') !== null);
        console.log(isLoggedIn)
    }, [location, isLoggedIn]);
    
    return ( 
        <>
        {localStorage.getItem('userId') !== null &&
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-btn">
                    <button className="menu-button" onClick={toggleMenu}>
                        <img src={openBtn} alt="open"></img>
                    </button>
                </div>
                <div className="avatar">
                    <img className="avatar" src={getImageUrl()} alt="Avatar" />
                </div>
                <ul>
                    <li>
                        <a className="link" href="/profile">
                            <img src={profile} />
                            {isOpen && <span>{t('menu.profile')}</span>}
                        </a>
                    </li>
                    {localStorage.getItem('is_admin') == 'true' &&
                    <li>
                        <a className="link" href="/admin">
                            <img src={admin} />
                            {isOpen && <span>{t('menu.admin')}</span>}
                        </a>
                    </li>
                    }
                    
                    <li>
                        <a className="link" href="/certificates">
                            <img src={certificates} />
                            {isOpen && <span>{t('menu.certificates')}</span>}
                        </a>
                    </li>
                    <li>
                        <a className="link" href="/usefulservices">
                            <img src={usefulServices} />
                            {isOpen && <span>{t('menu.usefulServices')}</span>}
                        </a>
                    </li>
                    <li>
                        <a className="link" href="/">
                            <img src={events} />
                            {isOpen && <span>{t('menu.events')}</span>}
                        </a>
                    </li>
                    <li>
                        {isOpen && 
                            <div className='logout' onClick={logout}>
                                <span className='link'>{t('menu.logout')}</span>
                            </div>
                        }
                    </li>
                </ul>
                
                
            </div>
        }
       </> 
    );
};

export default SidebarMenu;

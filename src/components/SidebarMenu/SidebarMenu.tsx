import { useState } from "react";
import './sidebarMenu.scss'
import openBtn from '@/assets/icons/sidebarMenu/openBtn.svg'
import profile from '@/assets/icons/sidebarMenu/profile.svg'
import admin from '@/assets/icons/sidebarMenu/admin.svg'
import certificates from '@/assets/icons/sidebarMenu/certificates.svg'
import usefulServices from '@/assets/icons/sidebarMenu/usefulServices.svg'
import events from '@/assets/icons/sidebarMenu/events.svg'
import { useTranslation } from "react-i18next";



const SidebarMenu = () => {

    const { t } = useTranslation();
    
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-btn">
                <button className="menu-button" onClick={toggleMenu}>
                    <img src={openBtn} alt='open'></img>
                </button>
            </div>
            <ul>
            <li>
                    <a className="link" href="/profile">
                <img src={profile} />
                {t('menu.profile')}
                </a>
            </li>
            <li>
                <a className="link" href="#">
                <img src={admin} />
                {t('menu.admin')}
                </a>
            </li>
            <li>
                <a className="link" href="/certificates">
                <img src={certificates} />
                {t('menu.certificates')}
                </a>
            </li>
            <li>
                <a className="link" href="/usefulservices">
                <img src={usefulServices} />
                {t('menu.usefulServices')}
                </a>
            </li>
            <li>
                <a className="link" href="/events">
                <img src={events} />
                {t('menu.events')}
                </a>
            </li>
            </ul>
        </div>

    );
};

export default SidebarMenu;
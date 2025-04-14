import { useState } from "react";
import './sidebarMenu.scss'
import openBtn from '@/assets/icons/sidebarMenu/openBtn.svg'
import profile from '@/assets/icons/sidebarMenu/profile.svg'
import admin from '@/assets/icons/sidebarMenu/admin.svg'
import certificates from '@/assets/icons/sidebarMenu/certificates.svg'
import usefulServices from '@/assets/icons/sidebarMenu/usefulServices.svg'
import events from '@/assets/icons/sidebarMenu/events.svg'



const SidebarMenu = () => {
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
            <li><a className='link' href="/profile">
                <img src={profile} />
                Профиль
            </a></li>
            <li><a className='link' href="#">
                <img src={admin} />Администрирование</a></li>
            <li><a className='link' href="#">
                <img src={certificates} /> Справки</a></li>
            <li><a className='link' href="/usefulservices">
                <img src={usefulServices} />Полезные сервисы</a></li>
            <li><a className='link' href="#">
                <img src={events} />Мероприятия</a></li>

            </ul>
        </div>

    );
};

export default SidebarMenu;
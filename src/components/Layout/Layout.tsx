import { Outlet } from 'react-router-dom';
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu';
import TranslationSwitch from '@/components/TranslationSwitch/TranslationSwitch';

export const Layout = () => (
    <>
        <TranslationSwitch />
        <SidebarMenu />
        <Outlet />
    </>
);

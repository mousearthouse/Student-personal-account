import { Outlet } from 'react-router-dom';
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu'

export const Layout = () => (
  <>
  <SidebarMenu />
  <Outlet />
  </>
);
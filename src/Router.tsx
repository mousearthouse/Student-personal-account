import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';

import {
    LoginPage,
    ProfilePage,
    NotFoundPage,
    UsefulServicesPage,
    EventsPage,
    EventDetailsPage,
    CertificatesPage,
    AdminMainPage,
    AdminUsersPage,
    AdminUserDetailsPage,
    AdminUsefulServicesPage,
    AdminEventsPage,
    AdminEventDetailsPage,
    AdminEventCreate,
} from '@/pages/imports';

import { Layout } from '@/components/Layout/Layout';

import { ROUTES } from '@/utils/routes';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path={ROUTES.LOGINPAGE} element={<LoginPage />} />
            <Route path={ROUTES.PROFILEPAGE} element={<ProfilePage />} />
            <Route path={ROUTES.USEFULSERVICESPAGE} element={<UsefulServicesPage />} />
            <Route path={ROUTES.EVENTSPAGE} element={<EventsPage />} />
            <Route path={ROUTES.EVENTDETAILSPAGE} element={<EventDetailsPage />} />
            <Route path={ROUTES.CERTIFICATESPAGE} element={<CertificatesPage />} />
            <Route path={ROUTES.ADMINMAINPAGE} element={<AdminMainPage />} />
            <Route path={ROUTES.ADMINUSERSPAGE} element={<AdminUsersPage />} />
            <Route path={ROUTES.ADMINUSERDETAILSPAGE} element={<AdminUserDetailsPage />} />
            <Route path={ROUTES.ADMINUSEFULSERVICESPAGE} element={<AdminUsefulServicesPage />} />
            <Route path={ROUTES.ADMINEVENTSPAGE} element={<AdminEventsPage />} />
            <Route path={ROUTES.ADMINEVENTDETAILSPAGE} element={<AdminEventDetailsPage />} />
            <Route path={ROUTES.ADMINEVENTCREATE} element={<AdminEventCreate />} />

            <Route path="*" element={<NotFoundPage />} />
        </Route>,
    ),
);

export const Router = () => <RouterProvider router={router} />;

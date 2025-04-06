import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';

import {
    LoginPage,
    ProfilePage,
    NotFoundPage
} from '@/pages/imports';

import { Layout } from '@/components/Layout/Layout';

import { ROUTES } from '@/utils/routes';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path={ROUTES.LOGINPAGE} element = {<LoginPage/>} />
            <Route path={ROUTES.PROFILEPAGE} element = {<ProfilePage/>} />

            <Route path="*" element={<NotFoundPage />} />
        </Route>,
    )
)

export const Router = () => <RouterProvider router={router} />;
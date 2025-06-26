import './loginPage.scss';
import { useState } from 'react';
import auth from '@/assets/auth-picture.svg';
import { postUserLogin } from '@/utils/api/requests/loginUser';
import { useTranslation } from 'react-i18next';
import toast from '@/components/Notification/toast';

const LoginPage = () => {
    return (
        <main>
            <div className="container">
                <div className="img-block">
                    <img src={auth} alt="auth" height="400px" />
                </div>
                <div className="login-block">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
};

const LoginForm = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ email, password, rememberMe });

        try {
            const response = await postUserLogin({
                params: { email, password, rememberMe },
                config: {},
            });
            console.log(response.data);
            if (response.data.loginSucceeded) {
                toast.success('Все хорошо, перенаправляем в личный кабинет...');
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('refresh_token', response.data.refreshToken);
                window.location.href = '/profile';
            } else {
                console.log('Ошибка при входе. Проверьте введённые данные.');
                toast.error('Такого пользователя нет. Проверьте логин и пароль');
            }
        } catch (err) {
            console.log('Ошибка при входе. Проверьте введённые данные.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">{t('login.title')}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-form-w-label">
                        <label className="label-form" htmlFor="name">
                            {t('login.email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input login"
                            required
                        />
                    </div>

                    <div className="input-form-w-label">
                        <label className="label-form">{t('login.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input login"
                            required
                        />
                    </div>
                    <div className="form-switch">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="checkbox"
                            />
                            <span className="slider"></span>
                        </label>
                        <label className='switch-label'>
                            {t('login.rememberMe')}
                        </label>
                    </div>
                    <button type="submit" className="login-button">
                        {t('login.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

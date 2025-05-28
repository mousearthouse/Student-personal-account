import './loginPage.scss';
import { useState, useEffect, useCallback } from "react";
import auth from '@/assets/auth-picture.svg';
import { postUserLogin } from '@/utils/api/requests/loginUser';
import { toast, Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {

    return (
        <main>
            <Toaster position="top-center" />
            <div className='container'>
                <div className='img-block'>
                    <img src={auth} alt="auth" height="400px" />
                </div>
                <div className='login-block'>
                    <LoginForm />
                </div>
            </div>
        </main>
    );
};


const LoginForm = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ email, password, rememberMe });
    
        try {
            const response = await postUserLogin({
                params: { email, password, rememberMe },
                config: {}
            });
            console.log(response.data);
            if (response.data.loginSucceeded) {
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('refresh_token', response.data.refreshToken);
                window.location.href = '/profile';
            } else {
                console.log('Ошибка при входе. Проверьте введённые данные.');
                toast.warning('Такого пользователя нет. Проверьте логин и пароль'), {
                cancel: { label: 'Close', onClick: () => {} },}
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
                    <div className="form-group">
                        <label className="form-label">{t('login.email')}</label>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('login.password')}</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                        />
                    </div>
                    <div className="form-remember">
                        <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="checkbox"
                        />
                        <label className="checkbox-label">{t('login.rememberMe')}</label>
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
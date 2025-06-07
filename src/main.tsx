import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import { App } from './App.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>,
);

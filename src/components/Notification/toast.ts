import { addNotification } from './NotificationContainer';

const toast = {
  info: (message: string) => addNotification({ type: 'info', title: 'Информация', message }),
  success: (message: string) => addNotification({ type: 'success', title: 'Успех', message }),
  error: (message: string) => addNotification({ type: 'error', title: 'Ошибка', message }),
  warning: (message: string) => addNotification({ type: 'warning', title: 'Предупреждение', message }),
};

export default toast;

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ToastCss = {
    position: 'top-right',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

// ToastAlert({ type: 'success', message: 'This is a success toast message' });

const ToastAlert = ({ type, message }) => {
    if (type === 'error') {
        toast.error(message, ToastCss);
    } else if (type === 'warning') {
        toast.warning(message, ToastCss);
    } else {
        toast.success(message, ToastCss);
    }

}

export default ToastAlert;
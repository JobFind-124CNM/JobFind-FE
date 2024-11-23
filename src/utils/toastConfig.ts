import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    switch (type) {
        case "success":
            toast.success(message, toastOptions);
            break;
        case "error":
            toast.error(message, toastOptions);
            break;
        case "info":
            toast.info(message, toastOptions);
            break;
        case "warning":
            toast.warning(message, toastOptions);
            break;
        default:
            toast(message, toastOptions);
    }
};

export { ToastContainer, showToast };
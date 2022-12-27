import {toast} from 'react-toastify';

const toastError = (message) => {
    console.log('toast')
    toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
}

export {
    toastError
}
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";

export const service = (app) =>{
    app.use(ConfirmationService);
    app.use(ToastService);
}
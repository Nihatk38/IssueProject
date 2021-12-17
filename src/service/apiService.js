import axios from "axios";
import AuthService from "./auth.service";

export default axios.create({
    baseURL: "http://10.0.0.12:5001",
    //baseURL: "http://192.168.1.31:5001",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AuthService.getToken()}`
        /* "Content-Type": "application/x-www-form-urlencoded",*/

    }
})
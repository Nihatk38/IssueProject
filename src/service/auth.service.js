import apiService from "@/service/apiService";



const AuthService = {
    loginPost(user) {
        return apiService
            .post(`/api/Auth/login`, {
                UserId: user.UserId,
                Password: user.Password,
                GrantType: "password"

            })
            .then(response => {
                if (response.data.Success) {
                    localStorage.setItem('token', JSON.stringify(response.data.Payload));

                }

                return response.data;
            }).catch(e => {
                console.log(e);
            });
    },
    isAuth() {
        let token = JSON.parse(localStorage.getItem('token'));
        return token;
    },
    getUserId() {
        let token = JSON.parse(localStorage.getItem('token'));
        if (token) {

            return token.UserId;
        } else {
            return {};
        }
    },
    getFromTokenFullName(){
        let token = JSON.parse(localStorage.getItem('token'));
        if (token) {

            return token.FullName;
        } else {
            return {};
        }
    },
    getToken() {
        let token = JSON.parse(localStorage.getItem('token'));


        if (token) {
            return token.AccessToken;
        } else {
            return {};
        }
    }
}

export default AuthService;
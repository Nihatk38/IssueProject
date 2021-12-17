import apiService from "@/service/apiService";


const AuthService = {
    loginPost(user) {
        console.log("asdasdas",user)
        return apiService

            .post(`/api/Auth/login`, {
                UserId: user.UserId,
                Password: user.Password,
                GrantType:"password"

            })
            .then(response => {
                console.log("asd", response);
                if (response.data.Success) {
                    console.log(response.data);
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
    getUserId(){
        let token = JSON.parse(localStorage.getItem('token'));
        if (token) {

            return token.UserId;
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
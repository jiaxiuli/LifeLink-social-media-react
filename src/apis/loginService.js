import axios from './config';
class LoginService {
     
    login(userinfo) {
        return axios.post('/user_login', userinfo);
    }

    checkLoginStatus(id) {
        return axios.get(`/check_login_status?id=${id}`);
    }
}

export default new LoginService();
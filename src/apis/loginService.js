import axios from './config';
class LoginService {
     
    login(userinfo) {
        return axios.post('/user_login', userinfo);
    }

    checkLoginStatus() {
        return axios.get('/check_login_status');
    }
}

export default new LoginService();
import axios from 'axios';

class LoginService {

    login(userinfo) {
        return axios.post('http://localhost:3000/user_login', userinfo);
    }

    checkLoginStatus() {
        return axios.get('http://localhost:3000/check_login_status');
    }
}

export default new LoginService();
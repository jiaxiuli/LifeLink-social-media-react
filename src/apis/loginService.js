import axios from 'axios';

class LoginService {
    a = 1;
    login(userinfo) {
        return axios.post('http://localhost:3000/user_login', userinfo);
    }
}

export default new LoginService();
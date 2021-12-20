import axios from './config';

class RegisterService {
    checkIsEmailAvalible (email) {
        return axios.get(`/check_is_email_avalible?email=${email}`);
    }

    newUserRegister (info) {
        return axios.post('/user_register', info);
    }
}

export default new RegisterService();

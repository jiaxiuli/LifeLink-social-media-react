import axios from './config';

class RegisterService {
    checkIsEmailAvalible (email) {
        return axios.get(`/check_is_email_avalible?email=${email}`);
    }
}

export default new RegisterService();

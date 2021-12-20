import axios from './config';

class UserService {
    getUserInfoById (userId) {
        return axios.get(`/get_user_info_by_id?id=${userId}`);
    }

    uploadProfilePhoto (photoStr) {
        return axios.post('/upload_profile_photo', photoStr);
    }
}

export default new UserService();

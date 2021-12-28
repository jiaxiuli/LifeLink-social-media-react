import axios from './config';

class UserService {
    getUserInfoById (userId) {
        return axios.get(`/get_user_info_by_id?id=${userId}`);
    }

    uploadProfilePhoto (photoStr, userId) {
        return axios.post('/upload_profile_photo', { photoStr, userId });
    }

    getProfilePhoto (picId) {
        return axios.get(`/get_profile_photo?picId=${picId}`);
    }

    updateUserInfo (userId, info) {
        return axios.post('/update_user_info', { userId, info });
    }

    getFollowedUserInfo (userListStr) {
        return axios.get(`/get_followed_user_info?userListStr=${userListStr}`);
    }
}

export default new UserService();

import axios from './config';

class UserService {
  getUserInfoById (userId) {
    return axios.get(`/get_user_info_by_id?id=${userId}`);
  }
}

export default new UserService();

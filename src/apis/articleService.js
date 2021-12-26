import axios from './config';

class ArticleService {
    getAllCatagory () {
        return axios.get('/get_all_catagory');
    }
}

export default new ArticleService();

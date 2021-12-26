import axios from './config';

class ArticleService {
    getAllCatagory () {
        return axios.get('/get_all_catagory');
    }

    postAnArticle (article) {
        return axios.post('/post_an_article', { article });
    }
}

export default new ArticleService();

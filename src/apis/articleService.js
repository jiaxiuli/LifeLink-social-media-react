import axios from './config';

class ArticleService {
    getAllCatagory () {
        return axios.get('/get_all_catagory');
    }

    postAnArticle (article) {
        return axios.post('/post_an_article', { article });
    }

    getArticlesFromUserList (userList) {
        return axios.post('/get_articles_from_userList', { userList });
    }
}

export default new ArticleService();

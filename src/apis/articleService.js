import axios from './config';

class ArticleService {
    getAllCatagory () {
        return axios.get('/get_all_catagory');
    }

    postAnArticle (article) {
        return axios.post('/post_an_article', { article });
    }

    getArticlesFromUserList (userList, lastArticleId) {
        return axios.post('/get_articles_from_userList', { userList, lastArticleId });
    }

    updateArticleInfo (articleId, params) {
        return axios.post('/update_article_info', { articleId, params });
    }
}

export default new ArticleService();

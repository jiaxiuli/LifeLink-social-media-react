import axios from 'axios';

export const BASE_URL = 'http://localhost:3000/';

const service = axios.create({
    baseURL: BASE_URL, // node环境的不同，对应不同的baseURL
    timeout: 60000, // 请求的超时时间
    // 设置默认请求头，使post请求发送的是formdata格式数据// axios的header默认的Content-Type好像是'application/json;charset=UTF-8',我的项目都是用json格式传输，如果需要更改的话，可以用这种方式修改
    // headers: {
    // "Content-Type": "application/x-www-form-urlencoded"
    // },
    withCredentials: true // 允许携带cookie
});

export default service;

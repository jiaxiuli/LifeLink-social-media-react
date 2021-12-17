import React, { useEffect } from 'react';
import { message } from 'antd';
import { useHistory } from "react-router-dom";
import loginService from '../../apis/loginService';

const HomePage = () => {
    const history = useHistory();
    useEffect(() => {
        loginService.checkLoginStatus().then((res) => {
            if (!res.data.data.loginStatus) {
                message.warning('登陆状态过期 请重新登陆');
                history.push('/login');
            }
        });
    });
    
    return (<div>this is homepage</div>);
}

export default HomePage;
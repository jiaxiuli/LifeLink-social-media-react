import React from 'react';
import loginService from '../../apis/loginService';

const HomePage = () => {
    loginService.checkLoginStatus().then((res) => {
        console.log(res);
        if (res.data.data.status) {
            console.log('success');
            console.log(res.data.data.userInfo);
        } 
    });
    return (<div>this is homepage</div>);
}

export default HomePage;
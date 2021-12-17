import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import loginService from '../../apis/loginService';
import userService from '../../apis/userService';
import './header.scss';

const Header = (props) => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log(props);
    const userId = props.userId;
    loginService.checkLoginStatus(userId).then((res) => {
      if (!res.data.data.loginStatus) {
        message.warning('登陆状态过期 请重新登陆');
        history.push('/login');
      }
      return new Promise((resolve, reject) => {
        userService.getUserInfoById(userId).then((res) => {
          if (res.data.code === 200) resolve(res);
          // eslint-disable-next-line prefer-promise-reject-errors
          else reject();
        });
      });
    }).then((res) => {
      setUserInfo(res.data.data);
    }, () => {
      message.error('获取用户信息失败 请重试');
    });
  }, []);

  return (
    <div className='header-main-container'>
        Welcome, {userInfo?.username}
    </div>
  );
};

export default Header;

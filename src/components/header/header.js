import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import {
    // studentInfoStore,
    userInfoStore
} from '../../store/informationStore';
import { useHistory } from 'react-router-dom';
import loginService from '../../apis/loginService';
import userService from '../../apis/userService';
import {
    userInfoAction
} from '../../actions/informationActions';
import './header.scss';

const Header = (props) => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState(null);
    const [proPhoto, setProPhoto] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdTIgJFIUTtvW7R0KJeoB8L5jMgc6ePh5zkH2eJODnNxtq3pDKWEcjPbAWulFIuGMlb8I&usqp=CAU');
    useEffect(() => {
        if (userInfo) {
            userService.getProfilePhoto(userInfo.pic_id).then((res) => {
                if (res.data.code === 200) {
                    setProPhoto(res.data.data.pic);
                }
            }).catch(() => {
                message.warning('获取用户头像失败');
            });
        }
    }, [userInfo]);

    useEffect(() => {
        const userId = props.userId;
        loginService.checkLoginStatus(userId).then((res) => {
            if (!res.data.data.loginStatus) {
                message.warning('登陆状态过期 请重新登陆');
                throw new Error('user is not logined');
            } else {
                return new Promise((resolve, reject) => {
                    userService.getUserInfoById(userId).then((res) => {
                        if (res.data.code === 200) resolve(res);
                        // eslint-disable-next-line prefer-promise-reject-errors
                        else reject();
                    });
                });
            }
        }).then((res) => {
            // 向redux存入user信息
            userInfoStore.dispatch(userInfoAction(res.data.data));
        }).catch(() => {
            history.push('/login');
        });
        const cancelSub = userInfoStore.subscribe(() => {
            const infoFromRedux = userInfoStore.getState();
            setUserInfo(infoFromRedux);
        });
        return () => {
            cancelSub();
        };
    }, []);

    return (
        <div className='header-main-container'>
            <div style={{
                display: userInfo ? 'flex' : 'none',
                alignItems: 'center'
            }}>
                <div className='header-photo' style={{
                    backgroundImage: `url(${proPhoto})`
                }}></div>
                {
                    userInfo && userInfo.firstname && userInfo.lastname
                        ? (<div className='header-welcome'>
                            <div className='header-welcome-text'>
                                Welcome, {`${userInfo.firstname} ${userInfo.lastname}`}
                            </div>
                            <div className='header-welcome-slogan'>{`- "${userInfo.slogan}"`}</div>
                        </div>)
                        : (<div className='header-welcome'>Hello, welcome</div>)
                }
            </div>
        </div>
    );
};

export default Header;

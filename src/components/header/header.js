/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { DEFAULT_PHOTO_URL } from '../../static/defaultProfilePhoto';
import infoStore from '../../store/informationStore';
import { useHistory } from 'react-router-dom';
import loginService from '../../apis/loginService';
import userService from '../../apis/userService';
import articleService from '../../apis/articleService';
import {
    userInfoAction,
    followedUserInfoAction,
    catagoryInfoAction
} from '../../actions/informationActions';
import './header.scss';

const Header = (props) => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState(null);
    const [proPhoto, setProPhoto] = useState(DEFAULT_PHOTO_URL);
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
                throw new Error('not logined');
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
            const userInfo = res.data.data;
            // 向redux存入user信息
            infoStore.dispatch(userInfoAction(userInfo));
            return new Promise((resolve, reject) => {
                userService.getFollowedUserInfo(userInfo.follow).then((res) => {
                    if (res.data.code === 200) resolve(res);
                    // eslint-disable-next-line prefer-promise-reject-errors
                    else reject();
                });
            });
        }, (err) => {
            if (err.message === 'not logined') {
                throw new Error('not logined');
            } else {
                message.error('获取用户信息失败');
            }
        }).then((res) => {
            // 向redux存入关注列表信息
            infoStore.dispatch(followedUserInfoAction(res.data.data));
        }, (err) => {
            if (err.message === 'not logined') {
                throw new Error('not logined');
            } else {
                message.error('获取关注列表失败');
            }
        }).catch(() => {
            history.push('/login');
        });
        articleService.getAllCatagory().then((res) => {
            if (res.data.code === 200) {
                infoStore.dispatch(catagoryInfoAction(res.data.data));
            } else {
                message.warning('获取分类信息失败');
            }
        }).catch(() => {
            message.warning('获取分类信息失败');
        });
        const cancelSub = infoStore.subscribe(() => {
            const infoFromRedux = infoStore.getState();
            setUserInfo(infoFromRedux.userInfo);
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

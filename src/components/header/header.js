/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { DEFAULT_PHOTO_URL } from '../../static/defaultProfilePhoto';
import { useHistory } from 'react-router-dom';
import loginService from '../../apis/loginService';
import userService from '../../apis/userService';
import './header.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../../redux/slices/userInfoSlice';
import { getFollowedUserInfo } from '../../redux/slices/followListSlice';
import { getAllCatagory } from '../../redux/slices/catagorySlice';
const Header = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [proPhoto, setProPhoto] = useState(DEFAULT_PHOTO_URL);

    const userInfo = useSelector(state => state.userInfo.userInfo);

    useEffect(async () => {
        if (userInfo) {
            try {
                const res = await userService.getProfilePhoto(userInfo.pic_id);
                if (res.data.code === 200) {
                    setProPhoto(res.data.data.pic);
                } else {
                    throw new Error('获取用户头像失败');
                }
                dispatch(getFollowedUserInfo(userInfo.follow));
                dispatch(getAllCatagory());
            } catch (err) {
                console.error(err);
            }
        }
    }, [userInfo]);

    useEffect(async () => {
        try {
            const userId = props.userId;
            const { loginStatus } = (await loginService.checkLoginStatus(userId)).data.data;
            if (!loginStatus) {
                message.warning('登陆状态过期 请重新登陆');
                throw new Error('not logined');
            }
            dispatch(getCurrentUser(userId));
        } catch (err) {
            console.error(err);
            history.push('/login');
        }
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

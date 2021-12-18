import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import {
    studentInfoStore,
    userInfoStore
} from '../../store/informationStore';
import { useHistory } from 'react-router-dom';
import loginService from '../../apis/loginService';
import userService from '../../apis/userService';
import studentService from '../../apis/studentService';
import {
    userInfoAction,
    studentInfoAction
} from '../../actions/informationActions';
import './header.scss';

const Header = (props) => {
    const history = useHistory();
    const [studentInfo, setStudentInfo] = useState(null);

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
            const studentId = res.data.data.student_id;
            return new Promise((resolve, reject) => {
                studentService.getStudentInfoById(studentId).then((res) => {
                    if (res.data.code === 200) resolve(res);
                    // eslint-disable-next-line prefer-promise-reject-errors
                    else reject();
                });
            });
        }).then((res) => {
            // 向redux写入student信息
            studentInfoStore.dispatch(studentInfoAction(res.data.data));
        }).catch(() => {
            history.push('/login');
        });
        studentInfoStore.subscribe(() => {
            const infoFromRedux = studentInfoStore.getState();
            setStudentInfo(infoFromRedux);
        });
    }, []);

    return (
        <div className='header-main-container'>
            <div style={{
                display: studentInfo ? 'block' : 'none'
            }}>
                Welcome, {studentInfo ? `${studentInfo.firstname} ${studentInfo.lastname}` : 'user'}
            </div>
        </div>
    );
};

export default Header;

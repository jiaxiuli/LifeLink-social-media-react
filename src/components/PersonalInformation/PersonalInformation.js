/* eslint-disable no-unused-vars */
import React from 'react';
import InformationItem from '../InformationItem/InformationItem';
import { userInfoStore } from '../../store/informationStore';
import { Upload, message, Spin, Button } from 'antd';
import {
    userInfoAction
} from '../../actions/informationActions';
import { PlusOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import userService from '../../apis/userService';
import './PersonalInformation.scss';
import { useEffect, useState } from 'react/cjs/react.development';

const PersonalInformation = () => {
    const [info, setInfo] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [photoBase64Str, setPhotoBase64Str] = useState('');
    const [isChangePhotoLoading, setIsChangePhotoLoading] = useState(false);
    const [compareInfo, setCompareInfo] = useState(null);
    const [loginInfoLocked, setLoginInfoLocked] = useState(true);

    useEffect(() => {
        const cancelSub = userInfoStore.subscribe(() => {
            const obj = userInfoStore.getState();
            setInfo({
                ...obj
            });
            setCompareInfo({
                ...obj
            });
        });
        return () => {
            cancelSub();
        };
    }, []);

    useEffect(() => {
        if (info) {
            const basicInfo = [
                {
                    key: 'none',
                    name: 'title',
                    value: 'Basic Information'
                }, {
                    key: 'username',
                    name: 'Username',
                    value: info.username
                }, {
                    key: 'slogan',
                    name: 'Slogan',
                    value: info.slogan
                }, {
                    key: 'firstname',
                    name: 'First Name',
                    value: info.firstname
                }, {
                    key: 'lastname',
                    name: 'Last Name',
                    value: info.lastname
                }, {
                    key: 'gender',
                    name: 'Gender',
                    value: info.gender === 'm'
                        ? 'Male'
                        : info.gender
                }, {
                    key: 'date_of_birth',
                    name: 'Date of Birth',
                    value: info.date_of_birth
                        ? info.date_of_birth.slice(0, 10)
                        : info.date_of_birth
                }, {
                    key: 'occupation',
                    name: 'Occupation',
                    value: info.occupation
                }, {
                    key: 'company',
                    name: 'Company',
                    value: info.company
                }
            ];
            const contectInfo = [
                {
                    key: 'none',
                    name: 'title',
                    value: 'Contect'
                }, {
                    key: 'phone',
                    name: 'Phone',
                    value: info.phone
                }, {
                    key: 'email',
                    name: 'E-mail',
                    value: info.email
                }, {
                    key: 'country',
                    name: 'Country',
                    value: info.country
                }, {
                    key: 'province',
                    name: 'Province',
                    value: info.province
                }, {
                    key: 'city',
                    name: 'City',
                    value: info.city
                }, {
                    key: 'address',
                    name: 'Address',
                    value: info.address
                }
            ];
            setDataList([basicInfo, contectInfo]);
            getUserProfilePhoto();
        }
    }, [info]);

    useEffect(() => {
        if (photoBase64Str) {
            userService.uploadProfilePhoto(photoBase64Str, info.id).then((res) => {
                if (res.data.code === 200) {
                    // 上传头像成功 后端此时已经成功存储了图片 和 更新了user表中的pic_id
                    message.success('上传成功');
                    return new Promise((resolve) => {
                        // 前端的info并没有更新 所以需要重新请求用户信息
                        userService.getUserInfoById(info.id).then((res) => {
                            if (res.data.code === 200) {
                                resolve(res.data.data);
                            }
                        }).catch(() => {
                            message.warning('请重试');
                        });
                    });
                } else {
                    message.warning('上传失败');
                }
            }).then((user) => {
                // 重新请求到用户信息后 更新redux
                userInfoStore.dispatch(userInfoAction(user));
            }).catch(() => {
                message.error('上传失败');
            });
        }
    }, [photoBase64Str]);

    function getUserProfilePhoto () {
        if (info) {
            userService.getProfilePhoto(info.pic_id).then((res) => {
                const pic = res.data.data.pic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdTIgJFIUTtvW7R0KJeoB8L5jMgc6ePh5zkH2eJODnNxtq3pDKWEcjPbAWulFIuGMlb8I&usqp=CAU';
                const photoContainer = document.querySelector('.photo');
                photoContainer.style.backgroundImage = `url(${pic})`;
                setIsChangePhotoLoading(false);
            });
        }
    }

    function handleProfilePhotoUpload (file) {
        setIsChangePhotoLoading(true);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            setIsChangePhotoLoading(false);
            message.error('仅支持jpg/png格式图片');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            setIsChangePhotoLoading(false);
            message.error('图片需要小于2M');
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setPhotoBase64Str(reader.result);
        };
        return false;
    }

    function handleInfoChange (key, value) {
        setCompareInfo((prev) => {
            prev[key] = value;
            return { ...prev };
        });
    }

    function handleSubmitChangedInfo () {
        const change = {};
        Object.keys(info).forEach((item) => {
            if (info[item] !== compareInfo[item]) {
                change[item] = compareInfo[item];
            }
        });
        if (Object.keys(change).length === 0) {
            message.warning('没有数据更改');
        } else {
            userService.updateUserInfo(info.id, change).then((res) => {
                if (res.data.code === 200) {
                    return new Promise((resolve, reject) => {
                        userService.getUserInfoById(info.id).then((res) => {
                            if (res.data.code === 200) resolve(res);
                            // eslint-disable-next-line prefer-promise-reject-errors
                            else reject();
                        });
                    });
                } else {
                    message.warning('请刷新');
                    throw new Error('更新失败');
                }
            }).then((res) => {
                message.success('更新信息成功');
                // 向redux存入user信息
                userInfoStore.dispatch(userInfoAction(res.data.data));
            }).catch(() => {
                message.error('更新失败');
            });
        }
    }

    function toggleShowLoginInfo () {
        setLoginInfoLocked((prev) => !prev);
    }

    return (
        <div className='personal-information-container'>
            <div className='personal-information-photo-container'>
                <div className='photo' >
                    <Spin style={{
                        display: isChangePhotoLoading ? 'block' : 'none'
                    }}/>
                    <div className='profile-photo-loading-mask' style={{
                        opacity: isChangePhotoLoading ? 0.5 : 0
                    }}></div>
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        maxCount={1}
                        multiple={false}
                        listType="picture-card"
                        beforeUpload={handleProfilePhotoUpload}
                    >
                        <div className='personal-information-photo-uploader' title='更换头像'>
                            <PlusOutlined size='large'/>
                        </div>
                    </Upload>
                </div>
                <div className='name'>{`${info ? info.firstname : ''} ${info ? info.lastname : ''}`}</div>
                <div className='account-info'>
                    {
                        loginInfoLocked
                            ? (
                                <div style={{
                                    fontSize: 20,
                                    color: '#d4d4d4'
                                }}>
                                    account information
                                </div>
                            )
                            : (
                                <>
                                    <div className='login-info-item'>
                                        <div className='login-info-item-name'>Login Email: </div>
                                        <div className='login-info-item-value'>{info.email}</div>
                                        <div className='login-info-item-button'>
                                            <Button size='small' className='edit-login-info-button'>change</Button>
                                        </div>
                                    </div>
                                    <div className='login-info-item'>
                                        <div className='login-info-item-name'>Login Password: </div>
                                        <div className='login-info-item-value'>{info.password}</div>
                                        <div className='login-info-item-button'>
                                            <Button size='small' className='edit-login-info-button'>change</Button>
                                        </div>
                                    </div>
                                </>
                            )
                    }
                    <div className='login-info-hidden'>
                        <LockOutlined
                            style={{
                                fontSize: 20,
                                display: loginInfoLocked ? 'block' : 'none'
                            }}
                            title='show'
                            onClick={toggleShowLoginInfo}
                        />
                        <UnlockOutlined
                            style={{
                                fontSize: 20,
                                display: loginInfoLocked ? 'none' : 'block'
                            }}
                            title='hidden'
                            onClick={toggleShowLoginInfo}
                        />
                    </div>
                </div>
            </div>
            <div style={{
                display: 'flex'
            }}>
                {
                    dataList.length
                        ? dataList.map((item, index) => (
                            <InformationItem
                                info={item}
                                key={index}
                                handleInfoChange={handleInfoChange}
                            ></InformationItem>
                        ))
                        : null
                }
            </div>
            <Button className='confirm-edit-info-btn' onClick={handleSubmitChangedInfo}>确认修改</Button>
        </div>
    );
};

export default PersonalInformation;

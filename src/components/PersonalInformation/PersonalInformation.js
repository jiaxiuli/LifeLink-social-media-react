import React from 'react';
import InformationItem from '../InformationItem/InformationItem';
import { Upload, message, Spin, Button } from 'antd';
import { DEFAULT_PHOTO_URL } from '../../static/defaultProfilePhoto';
import { PlusOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import userService from '../../apis/userService';
import './PersonalInformation.scss';
import { useEffect, useState } from 'react/cjs/react.development';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../../redux/slices/userInfoSlice';
import { cloneDeep } from 'lodash';
const PersonalInformation = () => {
    const info = useSelector(state => state.userInfo.userInfo);
    const dispatch = useDispatch();
    const [dataList, setDataList] = useState([]);
    const [photoBase64Str, setPhotoBase64Str] = useState('');
    const [isChangePhotoLoading, setIsChangePhotoLoading] = useState(false);
    const [compareInfo, setCompareInfo] = useState(null);
    const [loginInfoLocked, setLoginInfoLocked] = useState(true);

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
            setCompareInfo(cloneDeep(info));
            setDataList([basicInfo, contectInfo]);
            getUserProfilePhoto();
        }
    }, [info]);

    useEffect(async () => {
        if (photoBase64Str) {
            try {
                const uploadRes = await userService.uploadProfilePhoto(photoBase64Str, info.id);
                if (uploadRes.data.code !== 200) {
                    throw uploadRes.data.message;
                }
                const res = await dispatch(getCurrentUser(info.id));
                if (res.meta.requestStatus === 'fulfilled') {
                    message.success('上传成功');
                } else {
                    message.error('重新获取数据失败');
                    throw res.meta.payload.error;
                }
            } catch (err) {
                console.error(err);
            }
        }
    }, [photoBase64Str]);

    async function getUserProfilePhoto () {
        if (info) {
            const res = await userService.getProfilePhoto(info.pic_id);
            const pic = res.data.data.pic || DEFAULT_PHOTO_URL;
            const photoContainer = document.querySelector('.photo');
            if (photoContainer) {
                photoContainer.style.backgroundImage = `url(${pic})`;
                setIsChangePhotoLoading(false);
            }
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

    async function handleSubmitChangedInfo () {
        const change = {};
        Object.keys(info).forEach((item) => {
            if (info[item] !== compareInfo[item]) {
                change[item] = compareInfo[item];
            }
        });
        if (Object.keys(change).length === 0) {
            message.warning('没有数据更改');
        } else {
            try {
                const updateRes = await userService.updateUserInfo(info.id, change);
                if (updateRes.data.code !== 200) {
                    message.error('更新失败');
                    throw updateRes.data.message;
                }
                const res = await dispatch(getCurrentUser(info.id));
                if (res.meta.requestStatus === 'fulfilled') {
                    message.success('更新信息成功');
                } else {
                    message.error('重新获取数据失败');
                    throw res.meta.payload.error;
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    function toggleShowLoginInfo () {
        setLoginInfoLocked((prev) => !prev);
    }

    return (
        <div className='personal-information-container' style={{
            display: info ? 'block' : 'none'
        }}>
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

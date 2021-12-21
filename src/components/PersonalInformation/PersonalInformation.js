import React from 'react';
import InformationItem from '../InformationItem/InformationItem';
import { userInfoStore } from '../../store/informationStore';
import { Upload, message, Spin } from 'antd';
import {
    userInfoAction
} from '../../actions/informationActions';
import { PlusOutlined } from '@ant-design/icons';
import userService from '../../apis/userService';
import './PersonalInformation.scss';
import { useEffect, useState } from 'react/cjs/react.development';

const PersonalInformation = () => {
    const [info, setInfo] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [photoBase64Str, setPhotoBase64Str] = useState('');
    const [isChangePhotoLoading, setIsChangePhotoLoading] = useState(false);
    useEffect(() => {
        const cancelSub = userInfoStore.subscribe(() => {
            setInfo(userInfoStore.getState());
        });
        return () => {
            cancelSub();
        };
    }, []);

    useEffect(() => {
        if (info) {
            const basicInfo = [
                {
                    key: 'title',
                    value: 'Basic Information'
                }, {
                    key: 'Username',
                    value: info.username
                }, {
                    key: 'Slogan',
                    value: info.slogan
                }, {
                    key: 'First Name',
                    value: info.firstname
                }, {
                    key: 'Last Name',
                    value: info.lastname
                }, {
                    key: 'Gender',
                    value: info.gender === 'm'
                        ? 'Male'
                        : info.gender
                }, {
                    key: 'Date of Birth',
                    value: info.date_of_birth
                        ? info.date_of_birth.slice(0, 10)
                        : info.date_of_birth
                }, {
                    key: 'Occupation',
                    value: info.occupation
                }, {
                    key: 'Company',
                    value: info.company
                }
            ];
            const contectInfo = [
                {
                    key: 'title',
                    value: 'Contect'
                }, {
                    key: 'Phone',
                    value: info.phone
                }, {
                    key: 'E-mail',
                    value: info.email
                }, {
                    key: 'Address',
                    value: `${info.country}, ${info.province}, ${info.city}, ${info.address}`
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
            </div>
            {
                dataList.length
                    ? dataList.map((item, index) => (
                        <InformationItem info={item} key={index}></InformationItem>
                    ))
                    : null
            }
        </div>
    );
};

export default PersonalInformation;

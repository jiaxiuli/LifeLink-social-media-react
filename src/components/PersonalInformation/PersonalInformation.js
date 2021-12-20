import React from 'react';
import InformationItem from '../InformationItem/InformationItem';
import { userInfoStore } from '../../store/informationStore';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import userService from '../../apis/userService';
import './PersonalInformation.scss';
import { useEffect, useState } from 'react/cjs/react.development';

const PersonalInformation = () => {
    const [info, setInfo] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [photoBase64Str, setPhotoBase64Str] = useState('');
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
        }
    }, [info]);

    useEffect(() => {
        if (photoBase64Str) {
            console.log(1111);
            userService.uploadProfilePhoto(photoBase64Str).then((res) => {
                console.log(res);
            }, () => {

            });
        }
    }, [photoBase64Str]);

    function handleProfilePhotoUpload (file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('仅支持jpg/png格式图片');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
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
                <div className='photo'>
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

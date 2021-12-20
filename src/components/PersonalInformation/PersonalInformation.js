import React from 'react';
import InformationItem from '../InformationItem/InformationItem';
import { userInfoStore } from '../../store/informationStore';
import './PersonalInformation.scss';
import { useEffect, useState } from 'react/cjs/react.development';

const PersonalInformation = () => {
    const [info, setInfo] = useState(null);
    const [dataList, setDataList] = useState([]);
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
    return (
        <div className='personal-information-container'>
            <div className='personal-information-photo-container'>
                <div className='photo'></div>
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

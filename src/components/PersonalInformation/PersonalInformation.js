import React from 'react';
import InformationItem from '../InformationItem/InformationItem';
import { studentInfoStore } from '../../store/informationStore';
import './PersonalInformation.scss';
import { useEffect, useState } from 'react/cjs/react.development';

const PersonalInformation = () => {
    const [info, setInfo] = useState(null);
    const [dataList, setDataList] = useState([]);
    useEffect(() => {
        studentInfoStore.subscribe(() => {
            setInfo(studentInfoStore.getState());
        });
    }, []);
    useEffect(() => {
        if (info) {
            const basicInfo = [
                {
                    key: 'title',
                    value: 'Basic Information'
                },
                {
                    key: 'First Name',
                    value: info.firstname
                },
                {
                    key: 'Last Name',
                    value: info.lastname
                },
                {
                    key: 'Gender',
                    value: info.gender
                },
                {
                    key: 'Date of Birth',
                    value: info.date_of_birth
                }
            ];
            const RecordInfo = [
                {
                    key: 'title',
                    value: 'Record Information'
                }, {
                    key: 'Student No.',
                    value: info.number
                },
                {
                    key: 'Faculty',
                    value: info.faculty
                }, {
                    key: 'Major',
                    value: info.major
                }, {
                    key: 'Grade',
                    value: info.grade
                }, {
                    key: 'Class',
                    value: info.class
                }
            ];
            const contectInfo = [
                {
                    key: 'title',
                    value: 'Contect'
                },
                {
                    key: 'Phone',
                    value: info.phone
                },
                {
                    key: 'E-mail',
                    value: info.email
                }
            ];
            setDataList([basicInfo, RecordInfo, contectInfo]);
        }
    }, [info]);
    return (
        <div className='personal-information-container'>
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

import React from 'react';
import Header from '../../components/Header/header';
import Navigator from '../../components/Navigator/Navigator';
import PersonalInformation from '../../components/PersonalInformation/PersonalInformation';
import './Homepage.scss';

const HomePage = (props) => {
    return (
        <>
            <div className='homepage'>
                <Header userId={props.match.params.id}></Header>
                <div className='homepage-main'>
                    <Navigator></Navigator>
                    <div className='homepage-contentContainer'>
                        <div className='homepage-content'>
                            <div className='homepage-content-header'>Personal Information</div>
                            <div className='homepage-content-component'>
                                <PersonalInformation></PersonalInformation>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

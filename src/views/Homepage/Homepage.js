import React from 'react';
import { useState } from 'react/cjs/react.development';
import Header from '../../components/Header/header';
import Navigator from '../../components/Navigator/Navigator';
import PersonalInformation from '../../components/PersonalInformation/PersonalInformation';
import './Homepage.scss';

const HomePage = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(1);

    function handleMenuItemClicked (index) {
        setSelectedIndex(index);
    }
    return (
        <>
            <div className='homepage'>
                <Header userId={props.match.params.id}></Header>
                <div className='homepage-main'>
                    <Navigator handleMenuItemClicked={handleMenuItemClicked}></Navigator>
                    <div className='homepage-main-content-right'
                        style={{
                            transform: `translateX(${(selectedIndex - 1) * -100}%)`
                        }}>
                        <div className='homepage-contentContainer'>
                            <div className='homepage-content'>
                                <div className='homepage-content-header'>Personal Information</div>
                                <div className='homepage-content-component'>
                                    <PersonalInformation></PersonalInformation>
                                </div>
                            </div>
                        </div>
                        <div className='homepage-contentContainer'></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

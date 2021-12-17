import React from 'react';
import Header from '../../components/Header/header';
import Navigator from '../../components/Navigator/Navigator';
import './Homepage.scss';

const HomePage = (props) => {
  return (
        <>
            <div className='homepage-main'>
                <Header userId={props.match.params.id}></Header>
                <Navigator></Navigator>
            </div>
        </>
  );
};

export default HomePage;

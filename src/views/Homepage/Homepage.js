import React from 'react';
import {
    useRouteMatch,
    Route,
    useHistory,
    Redirect
} from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import Header from '../../components/Header/header';
import Navigator from '../../components/Navigator/Navigator';
import PersonalInformation from '../../components/PersonalInformation/PersonalInformation';
import './Homepage.scss';

const HomePage = (props) => {
    const { path, url, params } = useRouteMatch();
    const history = useHistory();

    function handleMenuItemClicked (index) {
        if (index === 1) {
            history.push(`${url}/Personal-Information`);
        }
        if (index === 2) {
            history.push(`${url}/Post-Something`);
        }
    }
    return (
        <>
            <div className='homepage'>
                <Header userId={params.id}></Header>
                <div className='homepage-main'>
                    <Navigator handleMenuItemClicked={handleMenuItemClicked}></Navigator>
                    <div className='homepage-main-content-right'>
                        {
                            <QueueAnim className='homepage-main-content-right-scroller' interval={1000}>
                                <Route path={path} exact render={() => (
                                    <Redirect to={`${url}/Personal-Information`}/>)}
                                />

                                <Route path={`${path}/Personal-Information`}>
                                    <div className='homepage-contentContainer'>
                                        <div className='homepage-content'>
                                            <div className='homepage-content-header'>Personal Information</div>
                                            <div className='homepage-content-component'>
                                                <PersonalInformation></PersonalInformation>
                                            </div>
                                        </div>
                                    </div>
                                </Route>

                                <Route path={`${path}/Post-Something`}>
                                    <div className='homepage-contentContainer'>123123</div>
                                </Route>
                            </QueueAnim>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

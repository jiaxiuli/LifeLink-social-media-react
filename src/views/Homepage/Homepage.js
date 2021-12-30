import React from 'react';
import {
    useRouteMatch,
    Route,
    useHistory,
    Redirect
} from 'react-router-dom';
// import {
//     catagoryInfo
// } from '../../actions/informationActions';
// import { catagoryInfoStore } from '../../store/informationStore';
// import articleService from '../../apis/articleService';
import Header from '../../components/Header/header';
import Navigator from '../../components/Navigator/Navigator';
import PersonalInformation from '../../components/PersonalInformation/PersonalInformation';
import EditPosting from '../../components/EditPosting/EditPosting';
import BrowsePosting from '../../components/BrowsePosting/BrowsePosting';
import './Homepage.scss';
// import { useEffect } from 'react/cjs/react.development';
// import { message } from 'antd';

const HomePage = (props) => {
    const { path, url, params } = useRouteMatch();
    const history = useHistory();

    // useEffect(() => {
    //     articleService.getAllCatagory().then((res) => {
    //         if (res.data.code === 200) {
    //             const catagoryList = res.data.data;
    //             catagoryInfoStore.dispatch(catagoryInfo(catagoryList));
    //         } else {
    //             message.warning('获取分类信息失败');
    //         }
    //     }).catch(() => {
    //         message.warning('获取分类信息失败');
    //     });
    // }, []);

    function handleMenuItemClicked (index) {
        if (index === 1) {
            history.push(`${url}/Personal-Information`);
        }
        if (index === 2) {
            history.push(`${url}/Write-Article`);
        }
        if (index === 3) {
            history.push(`${url}/Articles`);
        }
    }
    return (
        <>
            <div className='homepage'>
                <Header userId={params.id}></Header>
                <div className='homepage-main'>
                    <Navigator handleMenuItemClicked={handleMenuItemClicked}></Navigator>
                    <div className='homepage-main-content-right'>
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

                        <Route path={`${path}/Write-Article`}>
                            <div className='homepage-contentContainer'>
                                <EditPosting></EditPosting>
                            </div>
                        </Route>

                        <Route path={`${path}/Articles`}>
                            <div className='homepage-contentContainer'>
                                <BrowsePosting></BrowsePosting>
                            </div>
                        </Route>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

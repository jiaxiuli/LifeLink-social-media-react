/*
 * @Author: 李佳修
 * @Date: 2022-02-28 14:34:32
 * @LastEditTime: 2022-05-05 13:45:22
 * @LastEditors: 李佳修
 * @FilePath: /LifeLink-socal-media-app-nodeJS-server/Users/lijiaxiu/Documents/code/LifeLink-social-media-react/src/App.js
 */
import React from 'react';
import Login from './views/Login/Login';
import HomePage from './views/Homepage/Homepage';
import { Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';

function App () {
    return (
        <div>
            <Provider store={store}>
                <Route path="/" exact render={() => (
                    <Redirect to='/login'/>)}
                />
                <Route path="/login" component={Login}/>
                <Route path="/homepage/:id" component={HomePage}/>
            </Provider>
        </div>
    );
}

export default App;

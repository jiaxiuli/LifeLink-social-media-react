/*
 * @Author: 李佳修
 * @Date: 2022-05-05 13:33:38
 * @LastEditTime: 2022-05-05 14:20:36
 * @LastEditors: 李佳修
 * @FilePath: /LifeLink-socal-media-app-nodeJS-server/Users/lijiaxiu/Documents/code/LifeLink-social-media-react/src/redux/store.js
 */
import { configureStore } from '@reduxjs/toolkit';
import userInfoSlice from './slices/userInfoSlice';
import followListSlice from './slices/followListSlice';
import catagorySlice from './slices/catagorySlice';
import { logger } from 'redux-logger';

const store = configureStore({
    reducer: {
        userInfo: userInfoSlice,
        followList: followListSlice,
        catagory: catagorySlice
    },
    middleware:
        (getDefaultMiddelware) => getDefaultMiddelware().concat(logger)
});

export default store;

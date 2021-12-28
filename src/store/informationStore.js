import { createStore } from 'redux';
import { userInfoReducer, followedUserInfoReducer } from '../reducers/informationReducer';

export const userInfoStore = createStore(userInfoReducer);
export const followedUserInfoStore = createStore(followedUserInfoReducer);

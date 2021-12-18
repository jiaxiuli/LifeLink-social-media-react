import { createStore } from 'redux';
import { userInfoReducer } from '../reducers/informationReducer';

export const userInfoStore = createStore(userInfoReducer);

import { createStore } from 'redux';
import { studentInfoReducer, userInfoReducer } from '../reducers/informationReducer';

export const userInfoStore = createStore(userInfoReducer);
export const studentInfoStore = createStore(studentInfoReducer);

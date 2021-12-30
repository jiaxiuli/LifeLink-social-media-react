import { createStore } from 'redux';
import infoReducer from '../reducers/informationReducer';

const infoStore = createStore(infoReducer);

export default infoStore;

import { combineReducers } from 'redux';
import repos from './repos/reducer';
import files from './files/reducer';

export default combineReducers({ repos, files });
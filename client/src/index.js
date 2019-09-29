import './styles/index.scss';
import 'babel-polyfill';
import DIC from './dic';
import FilesList from './view/files-list';

const dic = new DIC();
window.DIC = dic;
window.FILES_LIST = new FilesList(dic.store);

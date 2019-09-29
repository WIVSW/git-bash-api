import './styles/index.scss';
import 'babel-polyfill';
import DIC from './dic';
import FilesList from './view/files-list';
import Form from './view/form';

const dic = new DIC();
window.DIC = dic;
window.FILES_LIST = new FilesList(dic.store);
window.FORM = new Form(dic.store, dic.actions);

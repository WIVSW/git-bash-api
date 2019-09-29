import './styles/index.scss';
import 'babel-polyfill';
import DIC from './dic';
import FilesList from './view/files-list';
import Form from './view/form';

const dic = new DIC();
new FilesList(dic.store);
new Form(dic.store, dic.actions);

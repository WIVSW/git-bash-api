import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DIC from './dic';
const dic = new DIC();

window.DIC = dic;
ReactDOM.render(<App />, document.getElementById('root'));

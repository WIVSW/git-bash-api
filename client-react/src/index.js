import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import DIC from './dic';
const dic = new DIC();

window.DIC = dic;
ReactDOM.render(
	(
		<Provider store={dic.store}>
			<App />
		</Provider>
	),
	document.getElementById('root')
);

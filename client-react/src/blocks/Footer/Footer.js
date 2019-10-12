import React from 'react';
import { cn } from '@bem-react/classname';


import {cnText} from '../Text/Text';

import './Footer.scss';
import {cnEdge} from "../Edge/Edge";
import {cnBlock} from "../Block/Block";

import {version} from '../../../package.json';

const cnFooter = cn('Footer');

const Footer = ({
	className = '',
	mods = {},
}) => {
	return (
		<div className={cnFooter(null, [
			cnEdge({top: true}),
			cnBlock()
		])}>
			<span>Trade secrets of Yandex LLC. 16, Lev Tolstoy Str., Moscow, Russia, 119021</span>
			<span>
				<span className={cnFooter('Version')}>UI: {version}</span>
				<span>© 2007—2019 <a href="https://yandex.ru/" target={'_blank'} className={cnText({type: 'link'})}>Yandex</a></span>
			</span>
		</div>
	);
};

export default Footer;

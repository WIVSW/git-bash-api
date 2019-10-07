import React from 'react';
import { cn } from '@bem-react/classname';

import Select from "../Select/Select";

import './Tabs.scss';
import {cnEdge} from "../Edge/Edge";
import {cnText} from "../Text/Text";

const cnTabs = cn('Tabs');


const Tabs = ({
    className = '',
	mods = {},
	tabs = [],
	children,
}) => {
	return (
		<div className={cnTabs(mods, [className])}>
			<div className={cnTabs('Head', [
				cnEdge({layout: true})
			])}>
				<div className={cnTabs('Wrap')}>
					{tabs.map(({text, url, isActive}, i) => {
						return (
							<Select key={i} mods={{active: isActive}} className={cnTabs('Item')}>
								<a href={url} className={cnText({
									weight: isActive ? 'bold' : null,
									color: isActive ? null : 'gray',
									size: 'xl',
									'letter-space': 'm'
								})}>{text}</a>
							</Select>
						);
					})}
				</div>
			</div>
			<div className={cnTabs('Body')}>
				{children}
			</div>
		</div>
	);
};

export default Tabs;
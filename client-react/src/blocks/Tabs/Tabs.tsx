import React from 'react';
import { cn } from '@bem-react/classname';

import Select from "../Select/Select";

import './Tabs.scss';
import {cnEdge} from "../Edge/Edge";
import {cnText} from "../Text/Text";

const cnTabs = cn('Tabs');

export interface ITab {
	text: string;
	url: string;
	isActive: boolean;
};

type TabsProps = {
	className?: string;
	mods?: Record<string, string>;
	tabs: ITab[];
	children?: React.ReactElement[] | React.ReactElement;
};

const Tabs = ({
    className = '',
	mods = {},
	tabs = [],
	children,
} : TabsProps) => {
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
									weight: isActive ? 'bold' : void 0,
									color: !isActive ? 'gray' : void 0,
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
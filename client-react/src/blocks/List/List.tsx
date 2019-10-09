import React from 'react';
import {Link} from "react-router-dom";
import { cn } from '@bem-react/classname';

import './List.scss';
import {cnBlock} from "../Block/Block";
import {cnText} from "../Text/Text";

const cnList = cn('List');

export interface ILink {
	id: string;
	text: string;
	url: string;
}

type ListProps = {
	className: string;
	mods: Record<string, string>;
	items: ILink[];
};

const List = ({
    className = '',
	mods = {},
	items = [],
} : ListProps) => {
	return (
		<div className={cnList(mods, [className, cnBlock()])}>
			{items.map((item) => <div
				key={item.id}
				className={cnList('Item')}
			>
				<Link
					className={cnText({type: 'link'})}
					to={item.url}
					style={{
						width: '100%',
						height: '100%',
						color: 'inherit',
					}}
				>{item.text}</Link>
			</div>)}
		</div>
	);
};

export default List;
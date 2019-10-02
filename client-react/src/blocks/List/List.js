import React from 'react';
import { cn } from '@bem-react/classname';

import './List.scss';
import {cnBlock} from "../Block/Block";

const cnList = cn('List');

const List = ({
    className = '',
	mods = {},
	items = [],
	onSelect = null
}) => {
	return (
		<div className={cnList(mods, [className, cnBlock()])}>
			{items.map((item) => <div
				key={item.id}
				className={cnList('Item')}
				onClick={onSelect ? onSelect.bind(null, item.id) : null}
			>
				{item.text}
			</div>)}
		</div>
	);
};

export default List;
import React from 'react';
import { cn } from '@bem-react/classname';

import { cnBlock } from "../Block/Block";

import './Grid.scss';

export const cnGrid = cn('Grid');

const Grid = ({
    className = '',
    mods = {},
	children
}) => {
	return (
		<div className={cnGrid(mods, [cnBlock()].concat([className]))}>
			{children}
		</div>
	);
};

export default Grid;
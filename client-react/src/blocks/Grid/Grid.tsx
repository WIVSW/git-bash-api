import React from 'react';
import { cn } from '@bem-react/classname';

import { cnBlock } from "../Block/Block";

import './Grid.scss';

export const cnGrid = cn('Grid');

type GridProps = {
	className?: string;
	mods: Record<string, string>;
	children?: React.ReactElement[] | React.ReactElement;
};

const Grid = ({
    className = '',
    mods = {},
	children
} : GridProps) => {
	return (
		<div className={cnGrid(mods, [cnBlock()].concat([className]))}>
			{children}
		</div>
	);
};

export default Grid;
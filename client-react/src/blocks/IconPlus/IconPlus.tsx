import React from 'react';
import { cn } from '@bem-react/classname';

import './IconPlus.scss';

export const cnIconPlus = cn('IconPlus');

type IconPlusProps = {
	className?: string;
	mods?: Record<string, string>;
	width: number;
	height: number;
	src: string;
	children?: React.ReactElement[] | React.ReactElement;
};

const IconPlus = ({
	className = '',
	mods = {},
	width = 10,
	height = 10,
	src = '',
	children,
} : IconPlusProps) => {
	return (
		<div className={cnIconPlus(mods, [className])}>
			<span className={cnIconPlus('Icon')}>
				<img src={src} width={width} height={height} alt={''} />
			</span>
			{children}
		</div>
	);
};

export default IconPlus;
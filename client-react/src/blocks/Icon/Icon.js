import React from 'react';
import { cn } from '@bem-react/classname';

import './Icon.scss';

const cnIcon = cn('Icon');

const Icon = ({
	className = '',
	src = '',
	width = 10,
	height = 6,
	center = false,
	alt = '',
}) => {
	const mods = {};

	if (center) {
		mods['v-align'] = 'center'
	}
	return (
		<div className={cnIcon(mods, [className])}>
			<img src={src} width={width} height={height} alt={alt}/>
		</div>
	);
};

export default Icon;
import React from 'react';
import { cn } from '@bem-react/classname';

import './Icon.scss';

export const cnIcon = cn('Icon');

type IconProps = {
	className: string;
	src: string;
	width: number;
	height: number;
	center: boolean;
	alt?: string;
}

const Icon = ({
	className = '',
	src = '',
	width = 10,
	height = 6,
	center = false,
	alt = '',
}) => {
	return (
		<div className={cnIcon({
			'v-align': center ? 'center' : void 0,
		}, [className])}>
			<img src={src} width={width} height={height} alt={alt}/>
		</div>
	);
};

export default Icon;
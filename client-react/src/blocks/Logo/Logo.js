import React from 'react';
import { cn } from '@bem-react/classname';

import './Logo.scss';

const cnLogo = cn('Logo');

const Logo = ({
    className = '',
    src = '',
    width = 10,
    height = 10,
    alt = '',
}) => {
	return (
		<div className={cnLogo(null, [className])}>
			<img
				className={cnLogo('Image')}
				src={src}
				width={width}
				height={height}
				alt={alt}
			/>
		</div>
	);
};

export default Logo;
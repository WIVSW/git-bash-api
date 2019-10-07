import React from 'react';
import { cn } from '@bem-react/classname';

import './Text.scss';

export const cnText = cn('Text');

const Text = ({
    className = '',
	mods = {},
	children
}) => {
	return (
		<span className={cnText(mods, [className])}>
			{children}
		</span>
	);
};

export default Text;
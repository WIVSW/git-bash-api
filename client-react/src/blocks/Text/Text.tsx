import React from 'react';
import { cn } from '@bem-react/classname';

import './Text.scss';

export const cnText = cn('Text');

type TextProps = {
	className?: string;
	mods?: Record<string, string>;
	children?: React.ReactElement[] | React.ReactElement;
};

const Text = ({
    className = '',
	mods = {},
	children
} : TextProps) => {
	return (
		<span className={cnText(mods, [className])}>
			{children}
		</span>
	);
};

export default Text;
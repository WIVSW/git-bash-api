import React from 'react';
import { cn } from '@bem-react/classname';

import './Layout.scss';

const cnLayout = cn('Layout');

const Layout = ({
    className = '',
	mods = {},
}) => {
	return (
		<div className={cnLayout(null, [className])}>
			asdf
		</div>
	);
};

export default Layout;
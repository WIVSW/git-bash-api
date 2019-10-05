import React from 'react';
import { cn } from '@bem-react/classname';

import './Editor.scss';

export const cnEditor = cn('Editor');

const Editor = ({
	className = '',
	mods = {},
}) => {
	return (
		<div className={cnEditor(mods, [className])}>
			EDITOR
		</div>
	);
};

export default Editor;
import React from 'react';
import { cn } from '@bem-react/classname';

import './Select.scss';
import Icon from "../Icon/Icon";
import arrowIcon from "../../img/arrow-down.svg";

export const cnSelect = cn('Select');

const Select = ({
    className = '',
    mods = {},
	titleMix = {},
	iconClassName = '',
	arrowVisible = false,
	children
}) => {
	return (
		<div className={cnSelect(mods, [className])}>
			<div className={cnSelect('Title', [titleMix])}>
				{children}
			</div>
			{
				arrowVisible ?
					<Icon
						className={iconClassName}
						src={arrowIcon}
						width={10}
						height={6}
						center={true}
					/> : null
			}
		</div>
	);
};

export default Select;
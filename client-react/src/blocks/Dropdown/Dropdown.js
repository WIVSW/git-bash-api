import React from 'react';
import { cn } from '@bem-react/classname';

import './Dropdown.scss';
import Select from "../Select/Select";
import {cnBlock} from "../Block/Block";

const cnDropdown = cn('Dropdown');

const Dropdown = ({
    className = '',
	iconClassName,
	children,
}) => {
	return (
		<div className={cnDropdown(null, [className, cnBlock()])}>
			<Select
				className={cnDropdown('Select')}
				mods={{active: true}}
				titleMix={cnBlock({'space-v': 'm'})}
				iconClassName={iconClassName}
				arrowVisible={true}
			>
				{children}
			</Select>
		</div>
	);
};

export default Dropdown;
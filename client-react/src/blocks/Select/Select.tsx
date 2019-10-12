import React from 'react';
import { cn } from '@bem-react/classname';

import './Select.scss';
import Icon from "../Icon/Icon";
import arrowIcon from "../../img/arrow-down.svg";
import {cnBlock} from "../Block/Block";

export const cnSelect = cn('Select');

type SelectProps = {
	className: string;
	mods: Record<string, (string|boolean)>;
	titleMix?: string;
	iconClassName?: string,
	arrowVisible?: boolean,
	children?: React.ReactElement[] | React.ReactElement;
};

const Select = ({
    className = '',
    mods = {},
	titleMix = '',
	iconClassName = '',
	arrowVisible = false,
	children
} : SelectProps) => {
	return (
		<div className={cnSelect(mods, [className, cnBlock()])}>
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
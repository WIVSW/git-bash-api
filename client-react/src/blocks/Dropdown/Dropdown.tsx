import React, { useState, useCallback } from 'react';
import { cn } from '@bem-react/classname';

import './Dropdown.scss';
import Select from "../Select/Select";
import {cnBlock} from "../Block/Block";
import List, {ILink} from "../List/List";

const cnDropdown = cn('Dropdown');

const INITIAL_STATE = {
	opened: false,
};

interface IDropdownState {
	opened: boolean;
}

type DropdownProps = {
	className?: string;
	iconClassName: string,
	items: ILink[],
	children?: React.ReactElement[] | React.ReactElement;
};

const Dropdown = ({
    className = '',
	iconClassName,
	items = [],
	children,
} : DropdownProps) => {
	const [state, setState] = useState<IDropdownState>(INITIAL_STATE);
	const onToggle = useCallback(() => setState({
		opened: !state.opened
	}), [state, setState])
	return (
		<div
			className={cnDropdown(null, [className, cnBlock()])}
			onClick={onToggle}
		>
			<Select
				className={cnDropdown('Select')}
				mods={{active: true}}
				titleMix={cnBlock({'space-v': 'm'})}
				iconClassName={iconClassName}
				arrowVisible={true}
			>
				{children}
			</Select>
			{
				state.opened ?
					<List
						className={cnDropdown('List')}
						mods={{shadow: 'dropdown'}}
						items={items}
					/>
				: null
			}
		</div>
	);
};

export default Dropdown;
import React from 'react';
import { cn } from '@bem-react/classname';

import './Table.scss';
import {cnBlock} from "../Block/Block";
import Text from "../Text/Text";

const cnTable = cn('Table');

const Table = ({
    className = '',
    mods = {},
	cells = [],
}) => {
	return (
		<div className={cnTable(mods, [className])}>
			<div className={cnTable('Row', null, [cnTable('Head')])}>
				{cells.map(({text, size}) => {
					const cellName = `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
					return (
						<div className={cnTable(
							'Cell',
							{size},
							[cnBlock({'d-space-h': 'xs'})]
						)}>
							<Text mods={{size: 'l'}}>
								{cellName}
							</Text>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Table;
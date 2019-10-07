import React from 'react';
import { cn } from '@bem-react/classname';

import './Table.scss';
import {cnBlock} from "../Block/Block";
import Text, {cnText} from "../Text/Text";
import {Link} from "react-router-dom";

import mobileArrow from '../../img/arrow-right.svg';
import folder from '../../img/folder.svg';
import file from '../../img/file.svg';

import {cnIcon} from "../Icon/Icon";
import IconPlus from "../IconPlus/IconPlus";

const cnTable = cn('Table');

const Table = ({
    className = '',
    mods = {},
	cells = [],
	rows = [],
	children,
}) => {
	return (
		<div className={cnTable(mods, [className])}>
			<div className={cnTable('Row', null, [cnTable('Head')])}>
				{cells.map(({text, size}, i) => {
					const cellName = `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
					return (
						<div key={i} className={cnTable(
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
			{rows.map((row, i) => {
				return (
					<div key={i} className={
						cnTable(
							'Row',
							null,
							[cnBlock({
								'm-space-t': 'm',
								'm-space-b': 'l',
								'm-space-r': 'xxxl'
							})])
					}>
						{cells.map(({
							text,
							size,
							order,
							weight,
							mobileLink,
							mobileWidthFull,
							type
						}, j) => {
							const data = row[text];

							if (!data) {
								return null;
							}

							const {value, url, iconType} = data;

							const ValueWrapper = ({children}) => iconType ?
								<IconPlus
									width={12}
									height={9}
									src={Table.IconTypes[iconType]}
								>{children}</IconPlus> :
								<React.Fragment>{children}</React.Fragment>;

							const Value = ({className = '', children}) => url ?
								<Link to={url} className={className}>{children}</Link> :
								<Text className={className}>{children}</Text>;

							return (
								<React.Fragment key={j}>
									{mobileLink ? <Link
										to={url}
										className={
											cnTable('CellIcon', null, [
												cnText({
													type: 'link'
												}),
												cnIcon({
													'v-align': 'center',
												})
											])
										}
									>
										<img src={mobileArrow} alt=""/>
									</Link> : null}
									<div className={cnTable(
										'Cell',
										{
											'm-width': mobileWidthFull ? 'full' : null,
											order,
										},
										[cnBlock({
											'd-space-h': 'xs',
											'm-space-v': 'm',
											'm-space-h': 'xxs'
										})]
									)}>
										<ValueWrapper>
											<Value className={cnText({
													size: 'l',
													weight: weight ? weight : null,
													type: type ? type : null,
											})}>
												{value}
											</Value>
										</ValueWrapper>
									</div>
								</React.Fragment>
							);
						})}
					</div>
				);
			})}
			{children}
		</div>
	);
};


Table.IconTypes = {
	'tree': folder,
	'blob': file
};

export default Table;
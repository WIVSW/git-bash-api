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

export interface ICell {
	text: string;
	size: string;
	order: number;
	weight?: string;
	mobileLink?: boolean;
	mobileWidthFull?: boolean;
	type?: string;
};

export interface IRow {
	value: string;
	url?: string;
	iconType?: string;
};

type TableProps = {
	className?: string;
	mods?: Record<string, string>;
	cells: ICell[],
	rows: { [key: string]: IRow }[],
	children?: React.ReactElement[] | React.ReactElement;
};

const IconTypes : { [key: string]: string } = {
	'tree': folder,
	'blob': file
};

const Table = ({
    className = '',
    mods = {},
	cells = [],
	rows = [],
	children,
} : TableProps) => {
	return (
		<div className={cnTable(mods, [className])}>
			<div className={cnTable('Row', null, [cnTable('Head')])}>
				{cells.map((
					{text, size} :
					{
						text: string;
						size: string;
					},
				i) => {
					const cellName : string = `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
					return (
						<div key={i} className={cnTable(
							'Cell',
							{size},
							[cnBlock({'d-space-h': 'xs'})]
						)}>
							<Text mods={{size: 'l'}}>
								<>{cellName}</>
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
							const data : IRow = row[text];

							if (!data) {
								return null;
							}

							const {value, url, iconType} = data;
							const icon : (string|null) = iconType ? IconTypes[iconType] : null;

							const ValueWrapper = (
								{children} :
								{children?: React.ReactElement[] | React.ReactElement}
							) => icon ?
								<IconPlus
									width={12}
									height={9}
									src={icon}
								>{children}</IconPlus> :
								<React.Fragment>{children}</React.Fragment>;

							const Value = (
								{className = '', children} :
								{
									className: string,
									children?: React.ReactElement[] | React.ReactElement
								}
							) => url ?
								<Link to={url} className={className}>{children}</Link> :
								<Text className={className}>{children}</Text>;

							return (
								<React.Fragment key={j}>
									{mobileLink && url ? <Link
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
											'm-width': mobileWidthFull ? 'full' : void 0,
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
												weight: weight ? weight : void 0,
												type: type ? type : void 0,
											})}>
												{<>{value}</>}
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

export default Table;
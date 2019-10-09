import React from 'react';
import { cn } from '@bem-react/classname';

import './Editor.scss';
import Icon from "../Icon/Icon";
import fileLogo from '../../img/file-black.svg';
import downloadLogo from '../../img/download.svg';
import Text, {cnText} from "../Text/Text";
import {cnBlock} from "../Block/Block";
import {Link} from "react-router-dom";
import {cnButton} from "../Button/Button";

import {isReservedWord} from "../../module/code-parser";

export const cnEditor = cn('Editor');
export const cnEditorHeadCol = (mods = {}) => cnEditor('HeadCol', mods);

export interface ILine {
	numbers: number[];
	value: string;
}

type EditorProps = {
	className?: string;
	mods?: Record<string, string>;
	filename?: string;
	lines: ILine[];
};

const Editor = ({
	className = '',
	mods = {},
	filename = '',
	lines = [],
} : EditorProps) => {
	return (
		<div className={cnEditor(mods, [className])}>
			<div className={cnEditor('Head', {
				color: 'gray',
			})}>
				<div className={cnEditor('HeadWrap')}>
					<div className={
						cnEditor('HeadRow', {
							orientation: 'left',
						})
					}>
						<div className={cnEditorHeadCol()}>
							<Icon src={fileLogo} width={9} height={13} />
						</div>
						<div className={cnEditorHeadCol({
							grow: true
						})}>
							<div className={cnText({
								size: 'm',
							}, [
								cnBlock({
									'm-space-h': 'm',
								})
							])}>
								<Text mods={{weight: 'bold'}}>
									{<>{filename}</>}
								</Text>
							</div>
						</div>
						<div className={
							cnEditor('Hidable', [
								cnEditorHeadCol({
									right: true,
								})
							])
						}>
							<Link
								to={`/404/`}
								className={cnText(null, [
									cnButton({
										bordered: true,
									})
								])}
							>
								<Icon src={downloadLogo} width={14} height={13}/>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className={cnEditor('Body')}>
				<div className={cnEditor('CodeWrap')}>
					<div className={cnEditor('Code', {
						'font-color': 'blue'
					})}>
						{lines.map(({
							numbers = [],
							value = '',
						}, i) => {
							const values = value
								.split(' ')
								.map((word, z) => {
									return isReservedWord(word.trim()) ?
										(<b key={z}>{word} </b>) :
										(<React.Fragment key={z}>{word} </React.Fragment>);
								});
							return (
								<div key={i} className={cnEditor('Line')}>
									{numbers.map((number, j) => (
											<div key={j} className={
												cnEditor('Col', null, [
													cnEditor('LineNumber')
												])
											}>
												{number}
											</div>
									))}
									<div
										key={numbers.length}
										className={cnEditor('Col')}
									>
										{values}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Editor;
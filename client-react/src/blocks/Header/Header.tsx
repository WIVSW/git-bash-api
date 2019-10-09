import React from 'react';
import {useSelector} from "react-redux";
import { cn } from '@bem-react/classname';

import Dropdown from "../Dropdown/Dropdown";
import Logo from '../Logo/Logo';
import Text from '../Text/Text';
import Grid, {cnGrid} from "../Grid/Grid";
import {cnBlock} from "../Block/Block";
import {cnEdge} from "../Edge/Edge";

import logo from '../../img/logo.svg';

import './Header.scss';

const cnHeader = cn('Header');


const Header = () => {
	const repos = useSelector((state) => state.repos.items);
	const selected = useSelector((state) => state.repos.selected);
	const repoName = selected || '';
	const items = repos.map((repo) => ({
		id: repo.id,
		text: repo.id,
		url: `/repository/${repo.id}`
	}));

	return (
		<div className={cnHeader(null, [
			cnEdge({bottom: true}),
			cnBlock()
		])}>
			<Grid mods={{
				'col-gap': 'l',
				'row-gap': 'l',
				'v-align': 'bottom'
			}}>
				<div className={
					cnGrid(
						'Item',
						[
							cnHeader('Logo'),
							cnHeader('Item')
						]
					)
				}>
					<Logo src={logo} width={118} height={20} alt="Yandex Arcanum"/>
				</div>
				<div className={
					cnGrid(
						'Item',
						[
							cnHeader('Header-Dropdown'),
							cnHeader('Item')
						]
					)
				}>
					<Dropdown
						iconClassName={cnHeader('Icon')}
						items={items}
					>
						<Text mods={{size: 'm', 'letter-space': 'xl', weight: 'bold', }}>Repository </Text>
						<Text mods={{size: 'm', 'letter-space': 'xl', }}>{repoName}</Text>
					</Dropdown>
				</div>
			</Grid>
		</div>
	);
};


export default Header;
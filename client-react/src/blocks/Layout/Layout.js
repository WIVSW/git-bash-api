import React from 'react';
import { cn } from '@bem-react/classname';

import {Switch, Route, Redirect} from "react-router-dom";

import './Layout.scss';
import FilesPage from "../../pages/files";

const cnLayout = cn('Layout');

const DEFAULT_BRANCH = 'master';
const Layout = ({
    className = '',
	mods = {},
	match,
	history,
	content,
}) => {
	return (
		<div className={cnLayout(null, [className])}>
			<Switch>
				<Route exact path={`${match.path}/`}>
					<Redirect to={`${match.url}/tree/${DEFAULT_BRANCH}`}/>
				</Route>
				<Route exact path={`${match.path}/tree`}>
					<Redirect to={`${match.url}/tree/${DEFAULT_BRANCH}`}/>
				</Route>
				<Route
					path={`${match.path}/tree/:hash/:path*`}
					component={FilesPage}
					match
					history
					content
				/>
			</Switch>
		</div>
	);
};

export default Layout;
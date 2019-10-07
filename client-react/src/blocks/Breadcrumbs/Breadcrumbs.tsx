import React from 'react';
import { cn } from '@bem-react/classname';
import {Link} from "react-router-dom";

import './Breadcrumbs.scss';
import {cnEdge} from "../Edge/Edge";
import {cnBlock} from "../Block/Block";
import {cnText} from "../Text/Text";

const cnBreadcrumbs = cn('Breadcrumbs');

const Breadcrumbs = ({
    className = '',
	crumbs = []
}) => {
	return (
		<div className={cnBreadcrumbs(null, [
			className,
			cnEdge({layout: true}),
			cnBlock({
				'indent-b': 'm',
				'd-indent-b': 'm'
			}),
			cnText({size: 'l'}),
		])}>
			{
				crumbs
					.map((crumb, i, arr) => {
						const isLast = (arr.length - 1) === i;
						return (
							<React.Fragment key={`${crumb.text}_FRAGMENT`}>
								<Link
									key={crumb.text}
									to={crumb.url}
									className={cnBreadcrumbs('Item', {
										selected: isLast
									})}
								>{crumb.text}</Link>
								{isLast ? null : <span key={`${crumb.text}/`} className="Breadcrumbs-Separator">/</span>}
							</React.Fragment>
						)
					})
			}
		</div>
	);
};

export default Breadcrumbs;
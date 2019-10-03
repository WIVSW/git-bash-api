import React from 'react';
import Breadcrumbs from "../blocks/Breadcrumbs/Breadcrumbs";

const parseCrumbs = (path, params) => {
	const crumbs = [];
	path
		.split('/')
		.filter(Boolean)
		.reduce((a, b) => {
			if (b.includes(':')) {
				const matched = b.match(/[\w\n]+/g);
				const param = matched[0] || null;
				const value = params[param];
				let values = [];

				if (value) {
					values = param === 'path' ?
						value.split('/') : [value];
				}

				return values.reduce((p, c) => {
					const part = `${p}/${c}`;
					const inst = { text: c, url: part };
					crumbs.push(inst);
					return part;
				}, a);
			}
			return `${a}/${b}`
		}, '');
	return crumbs;
}

const Page = ({
	history,
	match,
	children
}) => {
	const crumbs = match.path ? parseCrumbs(match.path, match.params) : [];
	return (
		<React.Fragment>
			<Breadcrumbs crumbs={crumbs}/>
			{children}
		</React.Fragment>
	);
};

export default Page;

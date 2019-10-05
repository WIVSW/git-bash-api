import React from 'react';
import Breadcrumbs from "../blocks/Breadcrumbs/Breadcrumbs";
import Tabs from "../blocks/Tabs/Tabs";

const parseCrumbs = (params = {}, fullUrl) => {
	const path = params.path || '';
	const map = {
		repository: params.id,
		tree: params.hash,
	};

	const parts = path
		.split('/')
		.filter(Boolean);

	parts
		.slice(0, -1)
		.forEach((part) => map[part] = null);

	const crumbs = [];
	Object
		.keys(map)
		.reduce((url, key) => {
			let link = `${url}/${key}`;
			let value = map[key];
			if (value) {
				link += `/${value}`
			} else {
				value = key;
			}
			crumbs.push({
				text: value,
				url: link
			});
			return link;
		}, '');

	const last = parts.slice(-1)[0];
	if (last) {
		crumbs.push({
			text: last,
			url: fullUrl
		})
	}

	return crumbs;
	return [
		{
			text: params.id,
			url: `/repository/${params.id}`
		}
	]
};

const Page = ({
	history,
	match,
	tabs,
	children
}) => {
	const crumbs = match.path ? parseCrumbs(match.params, match.url) : [];
	return (
		<React.Fragment>
			<Breadcrumbs crumbs={crumbs}/>
			<Tabs tabs={tabs}>{children}</Tabs>
		</React.Fragment>
	);
};

export default Page;

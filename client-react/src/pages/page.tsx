import React from 'react';
import Breadcrumbs from "../blocks/Breadcrumbs/Breadcrumbs";
import Tabs, {ITab} from "../blocks/Tabs/Tabs";
import {RouteComponentProps} from "react-router";
import {ICrumb} from "../blocks/Breadcrumbs/Breadcrumbs";

const parseCrumbs = (params : PageParams, fullUrl : string) : ICrumb[] => {
	const path : string = params.path || '';
	const map : { [key: string] : string | null } = {
		repository: params.id,
		tree: params.hash,
	};

	const parts : string[] = path
		.split('/')
		.filter(Boolean);

	parts
		.slice(0, -1)
		.forEach((part) => map[part] = null);

	const crumbs : ICrumb[] = [];
	Object
		.keys(map)
		.reduce((url : string, key : string ) => {
			let link : string = `${url}/${key}`;
			let value : (string | null) = map[key];
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

	const last : string = parts.slice(-1)[0];
	if (last) {
		crumbs.push({
			text: last,
			url: fullUrl
		})
	}

	return crumbs;
};

export type PageParams = {
	id: string,
	path?: string,
	hash: string,
}

type PageProps = RouteComponentProps<PageParams> & {
	tabs: ITab[];
	children?: React.ReactElement[] | React.ReactElement;
};

const Page = ({
	history,
	match,
	tabs,
	children
} : PageProps) => {
	const crumbs : ICrumb[] = match.path ? parseCrumbs(match.params, match.url) : [];
	return (
		<React.Fragment>
			<Breadcrumbs crumbs={crumbs}/>
			<Tabs tabs={tabs}>{children}</Tabs>
		</React.Fragment>
	);
};

export default Page;

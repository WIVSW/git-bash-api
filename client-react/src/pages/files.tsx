import React from 'react'
import Page, {PageParams} from './page';
import Table, {ICell, IRow} from "../blocks/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {loadFiles} from "../redux/trees/actions";
import {Redirect, RouteComponentProps} from 'react-router-dom';
import {IRootState} from "../redux/reducer";
import {ITree} from "../api/commits";
import {Types} from "../model/tree-item";

const createFilesTabs = (
	matchUrl : string,
	repoId : string,
	hash = 'master'
) => {
	const treeUrl = `/repository/${repoId}/tree`;
	const branchesUrl = `/repository/${repoId}/branches`;
	return [
		{
			text: 'files',
			url: treeUrl,
			isActive: matchUrl.includes(treeUrl),
		},
		{
			text: 'branches',
			url: branchesUrl,
			isActive: matchUrl.includes(branchesUrl),
		}
	];
};

const formatDate = (date : Date) : string => {
	const month = FilesPage.Monthes[date.getMonth()];
	return `${month} ${date.getDay() + 1}, ${date.getFullYear()}`;
};

const createRow = (
	name : string,
	link : string,
	iconType : string = '',
	hash : string = '',
	subject : string = '',
	author : string = '',
	date : string = ''
) => ({
	name: {
		value: name,
		url: link,
		iconType,
	},
	'last commit': {
		value: hash,
		url: '/404/',
	},
	'commit message': {
		value: subject,
	},
	committer: {
		value: author,
		url: '/404/',
	},
	updated: {
		value: date,
	},
});

const parseTrees = (
	trees : ITree[] = [],
	url : string,
	id : string,
	hash : string,
	path : string = ''
) : { [key: string]: IRow }[] => {
	const dirs = trees.filter((file) => file.treeItem.isDir);
	const blobs = trees.filter((file) => file.treeItem.isFile);
	const urlPart = url.split('/').filter(Boolean);
	const pathPart = path.split('/').filter(Boolean);
	const prepended = pathPart.length ? [createRow(
		'..',
		`/${urlPart.slice(0, -1).join('/')}`,
		Types.TREE
		)] : [];

	const rows = dirs
		.concat(blobs)
		.map(({treeItem, commit}) => {
			const fullPath = path ? `${path}/${treeItem.name}` : treeItem.name;
			return createRow(
				treeItem.name,
				`/repository/${id}/${treeItem.mode}/${hash}/${fullPath}`,
				treeItem.mode,
				commit.hash ? commit.hash.short[0] || '' : '',
				commit.subject,
				commit.author,
				formatDate(commit.date)
			);
		});
	return prepended.concat(rows);
};

const TABLE_CELLS : ICell[] = [
	{
		text: 'name',
		size: 'm',
		order: 1,
		weight: 'bold',
		mobileLink: true,
		mobileWidthFull: true
	},
	{
		text: 'last commit',
		size: 'l',
		order: 3,
		type: 'link'
	},
	{
		text: 'commit message',
		size: 'xl',
		order: 2,
		mobileWidthFull: true
	},
	{
		text: 'committer',
		size: 's',
		order: 4,
		type: 'person'
	},
	{
		text: 'updated',
		size: 's',
		order: 5
	},
];

const FilesPage = (props : RouteComponentProps<PageParams>) => {
	const {id, hash, path = ''} = props.match.params;
	const {url} = props.match;
	const tabs = createFilesTabs(url, id, hash);

	const dispatch = useDispatch();
	const files = useSelector(({trees} : IRootState) => (trees.trees[id] && trees.trees[id][path]) || []);
	const isLoading = useSelector(({trees} : IRootState) => trees.filesLoading);
	const error = useSelector(({trees} : IRootState) => trees.loadingError);

	if (error) {
		return <Redirect to={'/404/'}/>
	}

	if (!error && !isLoading && !files.length) {
		dispatch(loadFiles(id, hash, path));
	}

	const rows = (files.length && parseTrees(files, url, id, hash, path)) || [];

	return (
		<Page {...props} tabs={tabs}>
			<Table cells={TABLE_CELLS} rows={rows}>
				{isLoading ? <div>Loading...</div> : void 0}
			</Table>
		</Page>
	);
};

/**
 * @type {Array<string>}
 */
FilesPage.Monthes = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'June',
	'July',
	'Aug',
	'Sept',
	'Oct',
	'Nov',
	'Dec',
];

export default FilesPage;

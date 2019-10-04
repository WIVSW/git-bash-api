import React from 'react'
import Page from './page';
import Table from "../blocks/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {loadFiles} from "../redux/repos/actions";
import TreeItem from "../model/tree-item";

const createFilesTabs = (matchUrl, repoId, hash = 'master') => {
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

const formatDate = (date) => {
	const month = FilesPage.Monthes[date.getMonth()];
	return `${month} ${date.getDay() + 1}, ${date.getFullYear()}`;
};

const createRow = (
	name,
	link,
	iconType = '',
	hash = '',
	subject = '',
	author = '',
	date = ''
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

const parseTrees = (trees = [], url, id, hash, path = '') => {
	const dirs = trees.filter((file) => file.treeItem.isDir);
	const blobs = trees.filter((file) => file.treeItem.isFile);
	const urlPart = url.split('/').filter(Boolean);
	const pathPart = path.split('/').filter(Boolean);
	const prepended = pathPart.length ? [createRow(
		'..',
		`/${urlPart.slice(0, -1).join('/')}`,
		TreeItem.Types.TREE
		)] : [];

	const rows = dirs
		.concat(blobs)
		.map(({treeItem, commit}) => {
			return createRow(
				treeItem.name,
				`/repository/${id}/${treeItem.mode}/${hash}/${path}/${treeItem.name}`,
				treeItem.mode,
				commit.hash ? commit.hash.short[0] || '' : '',
				commit.subject,
				commit.author,
				formatDate(commit.date)
			);
		});
	return prepended.concat(rows);
};

const TABLE_CELLS = [
	{
		text: 'name',
		size: 'm',
		order: 1,
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
		order: 2
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

const FilesPage = (props) => {
	const {id, hash, path = ''} = props.match.params;
	const {url} = props.match;
	const tabs = createFilesTabs(url, id, hash);

	const dispatch = useDispatch();
	const files = useSelector(({repos}) => (repos.trees[id] && repos.trees[id][path]) || []);
	const isLoading = useSelector(({repos}) => repos.filesLoading);

	if (!isLoading && !files.length) {
		dispatch(loadFiles(id, hash, path, url));
	}

	const rows = (files.length && parseTrees(files, url, id, hash, path)) || [];

	return (
		<Page {...props} tabs={tabs}>
			<Table cells={TABLE_CELLS} rows={rows}>
				{isLoading ? <div>Loading...</div> : null}
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

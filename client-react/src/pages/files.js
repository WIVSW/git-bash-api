import React from 'react'
import Page from './page';
import Table from "../blocks/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {loadFiles} from "../redux/repos/actions";

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

const parseTrees = (trees = [], url) => {
	const dirs = trees.filter((file) => file.treeItem.isDir);
	const blobs = trees.filter((file) => file.treeItem.isFile);
	const urlPart = url.split('/').filter(Boolean);
	return dirs.concat(blobs).map(({treeItem, commit}) => {
		return {
			name: {
				value: treeItem.name,
				url: urlPart.concat([treeItem.name])
					.reduce((a, b) => `${a}/${b}`, ''),
				iconType: treeItem.mode
			},
			'last commit': {
				value: commit.hash ? commit.hash.short[0] || '' : '',
				url: '/404/',
			},
			'commit message': {
				value: commit.subject,
			},
			committer: {
				value: commit.author,
				url: '/404/',
			},
			updated: {
				value: formatDate(commit.date),
			},
		};
	});
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

	const rows = (files.length && parseTrees(files, url)) || [];

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

import React from 'react'
import Page from './page';
import Table from "../blocks/Table/Table";

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


const TABLE_CELLS = [
	{
		text: 'name',
		size: 'm',
		order: 1,
		type: 'icon',
	},
	{
		text: 'Last commit',
		size: 'l',
		order: 3,
		type: 'link'
	},
	{
		text: 'Commit message',
		size: 'xl',
		order: 2
	},
	{
		text: 'Committer',
		size: 's',
		order: 4,
		type: 'person'
	},
	{
		text: 'Updated',
		size: 's',
		order: 5
	},
];

const FilesPage = (props) => {
	const {id, hash} = props.match.params;
	const tabs = createFilesTabs(props.match.url, id, hash);
	return (
		<Page {...props} tabs={tabs}>
			<Table cells={TABLE_CELLS}>
				<div>TABLE</div>
			</Table>
		</Page>
	);
};

export default FilesPage;

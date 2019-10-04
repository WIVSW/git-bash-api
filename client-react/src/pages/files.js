import React from 'react'
import Page from './page';

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

const FilesPage = (props) => {
	const {id, hash} = props.match.params;
	const tabs = createFilesTabs(props.match.url, id, hash);
	return (
		<Page {...props} tabs={tabs}>
			<div>FILES PAGE</div>
		</Page>
	);
};

export default FilesPage;

const {
	getReposList,
	remove,
	download,
} = require('../modules/repository-actions');

const {
	getCommitsList,
	getFilesList,
	getCommitDiff,
} = require('../modules/commits-actions');

const Actions = {
	READ_REPOS_LIST: 'read-repos-list',
	REMOVE_REPO: 'remove-repo',
	DOWNLOAD_REPO: 'download-repo',
	READ_COMMITS_LIST: 'read-commits-list',
	LIST_DIR: 'list-dir',
	COMMIT_DIFF: 'commit-diff',
};

const Handers = {};
Handers[Actions.READ_REPOS_LIST] = getReposList;
Handers[Actions.REMOVE_REPO] = remove;
Handers[Actions.DOWNLOAD_REPO] = download;
Handers[Actions.READ_COMMITS_LIST] = getCommitsList;
Handers[Actions.LIST_DIR] = getFilesList;
Handers[Actions.COMMIT_DIFF] = getCommitDiff;

const memo = new Map();

const execute = async (key, args = []) => {
	const action = Handers[key];
	const callId = [key]
		.concat(args)
		.map(String)
		.join('#');

	if (memo.has(callId)) {
		return await memo.get(callId);
	}

	const promise = action(...args);

	memo.set(callId, promise);

	return promise
		.finally(() => memo.delete(callId));
};

const readReposList = async () => {
	return await execute(Actions.READ_REPOS_LIST);
};

const removeRepo = async (...args) => {
	return await execute(Actions.REMOVE_REPO, args);
};

const downloadRepo = async (...args) => {
	return await execute(Actions.DOWNLOAD_REPO, args);
};

const readCommitsList = async (...args) => {
	return await execute(Actions.READ_COMMITS_LIST, args);
};

const listDir = async (...args) => {
	return await execute(Actions.LIST_DIR, args);
};

const readCommitDiff = async (...args) => {
	return await execute(Actions.COMMIT_DIFF, args);
};

module.exports = {
	readReposList,
	removeRepo,
	downloadRepo,
	readCommitsList,
	listDir,
	readCommitDiff,
};

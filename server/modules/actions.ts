import {
	execute,
	spawnHistory,
	spawnDefault,
	removeRecursive,
	readdir,
	CommitProps,
	ICommit,
} from './utils';
import repositoryActions, {IRepo} from './repository-actions';
import commitsActions, {IFile} from './commits-actions';

const {
	getReposList,
	remove,
	download,
} = repositoryActions({execute, readdir, removeRecursive});

const {
	getCommitsList,
	getFilesList,
	getCommitDiff,
	getBlob,
} = commitsActions({execute, spawnHistory, spawnDefault});

enum Actions {
	READ_REPOS_LIST = 'read-repos-list',
	REMOVE_REPO = 'remove-repo',
	DOWNLOAD_REPO = 'download-repo',
	READ_COMMITS_LIST = 'read-commits-list',
	LIST_DIR = 'list-dir',
	COMMIT_DIFF = 'commit-diff',
	READ_BLOB = 'read-blob',
};

type Result = IRepo[] | void | ICommit[] | IFile[] | string;

const memo = new Map();

const run = async <R>(
	action : () => Promise<R>,
	callId : string
) : Promise<R> => {
	if (memo.has(callId)) {
		return await memo.get(callId);
	}

	const promise = action();

	memo.set(callId, promise);

	return promise
		.finally(() => memo.delete(callId));
};

const callId = (ids : (string|number)[]) : string => ids.map(String).join('#');

export const readReposList = async () : Promise<IRepo[]> => {
	return await run<IRepo[]>(
		getReposList.bind(null),
		Actions.READ_REPOS_LIST
	);
};

export const removeRepo = async (repoId : string) : Promise<void> => {
	return await run<void>(
		remove.bind(null, repoId),
		callId([Actions.REMOVE_REPO, repoId])
	);
};

export const downloadRepo = async (repoId : string, url : string) : Promise<void> => {
	return await run<void>(
		download.bind(null, repoId, url),
		callId([Actions.DOWNLOAD_REPO, repoId, url])
	);
};

export const readCommitsList = async (
	repoId : string,
	hash: string,
	offset: number = 0,
	limit: number = Infinity
) : Promise<ICommit[]> => {
	return await run<ICommit[]>(
		getCommitsList.bind(null, repoId, hash, offset, limit),
		callId([Actions.READ_COMMITS_LIST, repoId, hash, offset, limit])
	);
};

export const listDir = async (
	repoId: string,
    hash: string,
	path: string = ''
) : Promise<IFile[]> => {
	return await run<IFile[]>(
		getFilesList.bind(null, repoId, hash, path),
		callId([Actions.LIST_DIR, repoId, hash, path])
	);
};

export const readCommitDiff = async (
	repoId: string,
	hash: string,
) : Promise<string> => {
	return await run<string>(
		getCommitDiff.bind(null, repoId, hash),
		callId([Actions.COMMIT_DIFF, repoId, hash])
	);
};

export const readBlob = async (
	repoId: string,
	hash: string,
	path: string = ''
) : Promise<string> => {
	return await run<string>(
		getBlob.bind(null, repoId, hash, path),
		callId([Actions.READ_BLOB, repoId, hash, path])
	);
};

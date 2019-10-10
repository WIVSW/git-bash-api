import HashNotExist from '../models/responses/hash-not-exist';
import { join } from 'path';
import {getCommitFormat, ICommit, IExecResult, IHistoryParserOut} from './utils';

const deps : IDeps = {
	execute: void 0,
	spawnHistory: void 0,
	spawnDefault: void 0,
};

export interface IDeps {
	execute?: (cmd: string, args: string[], optRepoId?: string) => Promise<IExecResult> | null,
	spawnHistory?: (cmd : string, args : string[], optRepoId : string) => Promise<IHistoryParserOut>,
	spawnDefault?: (cmd : string, args : string[], optRepoId : string) => Promise<string>,
}

const commits = async (
	repoId : string,
	hash : string,
	offset : number,
	limit : number
) : Promise<ICommit[]> => {
	try {
		const {spawnHistory} = deps;

		if (!spawnHistory) {
			throw new HashNotExist();
		}

		const args = [
			'log',
			`--pretty="${getCommitFormat()}"`,
		];

		if (offset > 0) {
			args.push(`--skip=${offset}`);
		}

		if (isFinite(limit)) {
			args.push(`--max-count=${limit}`);
		}

		args.push(hash);

		const stdout = await spawnHistory('git', args, repoId);
		return stdout && stdout.commits || [];
	} catch (error) {
		throw new HashNotExist();
	}
};

const getCommitsList = async (
	repoId : string,
	hash : string,
	offset : number = 0,
	limit : number = Infinity
) : Promise<ICommit[]> => {
	return await commits(repoId, hash, offset, limit);
};

export interface IFile {
	mode: string;
	type: string;
	object: string;
	name: string;
}

const getFilesList = async (
	repoId : string,
	hash : string,
	path : string = ''
) : Promise<IFile[]> => {
	try {
		const {execute} = deps;

		if (!execute) {
			throw new HashNotExist();
		}

		const result = await execute(
			'git', [
				'--no-pager',
				'ls-tree',
				hash,
			], join(repoId, `./${path}`)
		);

		if (!result) {
			throw new HashNotExist();
		}

		return result.stdout
			.split('\n')
			.filter(Boolean)
			.map((row) => row
				.split(/(\s|\t)/g)
				.map((prop) => prop.trim())
				.filter(Boolean)
			)
			.map(([mode, type, object, name]) => ({mode, type, object, name}));
	} catch (error) {
		throw new HashNotExist();
	}
};

const getCommitDiff = async (
	repoId : string,
	hash : string
) : Promise<string> => {
	try {
		const {spawnDefault} = deps;
		if (!spawnDefault) {
			throw new HashNotExist();
		}

		return await spawnDefault(
			'git', [
				'show',
				hash,
			], repoId
		);
	} catch (error) {
		throw new HashNotExist();
	}
};

const getBlob = async (
	repoId: string,
	hash: string,
	path: string
) : Promise<string> => {
	try {
		const {spawnDefault} = deps;
		if (!spawnDefault) {
			throw new HashNotExist();
		}

		return await spawnDefault(
			'git', [
				'cat-file',
				`${hash}:${path}`,
				'-p',
			], repoId
		);
	} catch (error) {
		throw new HashNotExist();
	}
};

export default ({execute, spawnHistory, spawnDefault} : IDeps) => {
	deps.execute = execute;
	deps.spawnHistory = spawnHistory;
	deps.spawnDefault = spawnDefault;
	return {
		getCommitsList,
		getFilesList,
		getCommitDiff,
		getBlob,
	};
};

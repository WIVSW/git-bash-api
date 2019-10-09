import HashNotExist from '../models/responses/hash-not-exist';
import { join } from 'path';
import { getCommitFormat } from './utils';

const deps = {
	execute: null,
	spawnCmd: null,
	commitsHistoryParser: null,
};

const commits = async (repoId, hash, offset, limit) => {
	const {spawnCmd, commitsHistoryParser} = deps;
	try {
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

		const stdout = await spawnCmd('git', args, repoId, commitsHistoryParser);
		return stdout && stdout.commits || [];
	} catch (error) {
		throw new HashNotExist();
	}
};

const getCommitsList = async (repoId, hash, offset = 0, limit = Infinity) => {
	return await commits(repoId, hash, offset, limit);
};

const getFilesList = async (repoId, hash, path = '') => {
	const {execute} = deps;
	try {
		const {stdout} = await execute(
			'git', [
				'--no-pager',
				'ls-tree',
				hash,
			], join(repoId, `./${path}`)
		);
		return stdout
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

const getCommitDiff = async (repoId, hash) => {
	const {spawnCmd} = deps;
	try {
		return await spawnCmd(
			'git', [
				'show',
				hash,
			], repoId
		);
	} catch (error) {
		throw new HashNotExist();
	}
};

const getBlob = async (repoId, hash, path) => {
	const {spawnCmd} = deps;
	try {
		return await spawnCmd(
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

module.exports = ({execute, spawnCmd, commitsHistoryParser}) => {
	deps.execute = execute;
	deps.spawnCmd = spawnCmd;
	deps.commitsHistoryParser = commitsHistoryParser;
	return {
		getCommitsList,
		getFilesList,
		getCommitDiff,
		getBlob,
	};
};

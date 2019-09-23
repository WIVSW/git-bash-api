const COMMITS_CHUNK = 5;

const HashNotExist = require('../models/responses/hash-not-exist');
const {execute, getRepoPath} = require('./utils');
const {join} = require('path');
const {spawn} = require('child_process');
const readline = require('readline');

const CommitProps = {
	HASH: 'hash',
	HASH_SHORT: 'hash.short',
	HASH_FULL: 'hash.full',
	PARENT: 'parent',
	PARENT_SHORT: 'parent.short',
	PARENT_FULL: 'parent.full',
	TIMESTAMP: 'timestamp',
	AUTHOR: 'author',
	MESSAGE_SUBJECT: 'message.subject',
	MESSAGE_BODY: 'message.body',
};

const FormatKeysMap = {};
FormatKeysMap[CommitProps.HASH_SHORT] = '%h';
FormatKeysMap[CommitProps.HASH_FULL] = '%H';
FormatKeysMap[CommitProps.PARENT_SHORT] = '%p';
FormatKeysMap[CommitProps.PARENT_FULL] = '%P';
FormatKeysMap[CommitProps.TIMESTAMP] = '%ct';
FormatKeysMap[CommitProps.AUTHOR] = '%aN';
FormatKeysMap[CommitProps.MESSAGE_SUBJECT] = '%s';
FormatKeysMap[CommitProps.MESSAGE_BODY] = '%b';

const COMMIT_START = `СOMMIT_START`;
const COMMIT_END = `COMMIT_END`;
const PROP_START = `PROPERTY_START`;
const PROP_END = `PROPERTY_END`;

const getCommitFormat = () => {
	return `${COMMIT_START}${ Object
		.keys(FormatKeysMap)
		.map((key) => `${PROP_START}${key}===${FormatKeysMap[key]}${PROP_END}`)
		.join('')}${COMMIT_END}`;
};

const parseHashes = (hash) => hash ? hash.split(' ').filter(Boolean) : [];

const parseCommit = (obj) => {
	const rawTS = obj[CommitProps.TIMESTAMP];
	return {
		author: obj[CommitProps.AUTHOR] || null,
		hash: {
			short: parseHashes(obj[CommitProps.HASH_SHORT]),
			full: parseHashes(obj[CommitProps.HASH_FULL]),
		},
		parent: {
			short: parseHashes(obj[CommitProps.PARENT_SHORT]),
			full: parseHashes(obj[CommitProps.PARENT_FULL]),
		},
		message: {
			body: obj[CommitProps.MESSAGE_BODY] || null,
			subject: obj[CommitProps.MESSAGE_SUBJECT] || null,
		},
		timestamp: rawTS ? parseInt(rawTS) * 1000 : null,
	};
};

const commits = async (repoId, hash, offset, limit) => {
	try {
		const args = [
			'log',
			hash,
			`--pretty="${getCommitFormat()}"`,
		];

		if (offset > 0) {
			args.push(`--skip=${offset}`);
		}

		if (isFinite(limit)) {
			args.push(`--max-count=${limit}`);
		}

		const stdout = await spawnCmd('git', args, repoId, (out, line) => {
			if (!out) {
				out = {
					commits: [],
					string: '',
				};
			}

			out.string += `${line}\n`;
			const start = out.string.indexOf(COMMIT_START);
			const end = out.string.lastIndexOf(COMMIT_END);

			if (end !== -1) {
				const row = out.string.slice(start, end + COMMIT_END.length);
				const rawCommit = row
					.split(PROP_END)
					.map((prop) => {
						const index = prop.indexOf(PROP_START) + PROP_START.length;
						return prop.slice(index);
					})
					.filter(Boolean)
					.map((prop) => {
						let [key, value] = prop.split('===');
						value = value || null;
						return {[key]: value};
					})
					.reduce((a, b) => Object.assign(a, b), {});
				out.string = out.string.slice(end + COMMIT_END.length);
				const parsedCommit = parseCommit(rawCommit);
				out.commits.push(parsedCommit);
			}

			return out;
		});
		return stdout && stdout.commits || [];
	} catch (error) {
		throw new HashNotExist();
	}
};

const getCommitsList = async (repoId, hash, offset = 0, limit = Infinity) => {
	return await commits(repoId, hash, offset, limit);
};

const getFilesList = async (repoId, hash, path) => {
	try {
		const {stdout} = await execute(
			'git', [
				'ls-tree',
				hash,
			], join(repoId, `./${path}`)
		);
		return stdout
			.split('\n')
			.filter(Boolean)
			.map((row) => {
				const array = row.split('\t');
				const name = array.slice(-1)[0] || null;
				const isFile = array.some((col) => col.includes('blob'));
				const isDir = array.some((col) => col.includes('tree'));
				return {
					name,
					isFile,
					isDir,
				};
			});
	} catch (error) {
		throw new HashNotExist();
	}
};

const spawnCmd = async (cmd, args = [], optRepoId = '', optParser) => {
	const defaultParser = (out, line) => {
		if (!out) {
			out = '';
		}

		return `${out}${line}\n`;
	};
	const parser = typeof optParser !== 'undefined' ? optParser : defaultParser;
	return new Promise((resolve, reject) => {
		let out;
		const child = spawn(cmd, args, {
			cwd: getRepoPath(optRepoId),
		});

		const r1 = readline.createInterface({
			input: child.stdout,
			terminal: false,
		});

		r1.on('line', function(line) {
			out = parser(out, line);
		});

		child.on('error', (error) => {
			reject(error);
		});

		child.on('close', (code) => {
			if (code === 0) {
				resolve(out);
			} else {
				reject(out);
			}
		});
	});
};

const getCommitDiff = async (repoId, hash) => {
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

module.exports = {
	getCommitsList,
	getFilesList,
	getCommitDiff,
	getBlob,
};

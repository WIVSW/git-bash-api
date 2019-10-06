const {promisify} = require('util');
const {resolve} = require('path');
const exec = promisify(require('child_process').execFile);
const {spawn} = require('child_process');
const readline = require('readline');

const Response = require('../models/responses/response');
const Success = require('../models/responses/success');
const Unknown = require('../models/responses/unknown');

const handleRequest = async (action, req, res, ...rest) => {
	let response;
	try {
		const data = await action(req, res, ...rest);
		response = new Success(data);
	} catch (error) {
		response = error instanceof Response ? error : new Unknown();
	}
	const {code, message, data} = response;

	res
		.status(code)
		.send({message, data});
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

const getRepoPath = (repoId) =>
	resolve(process.env.PATH_TO_REPOS, `./${repoId}`);

const execute = async (cmd, args = [], optRepoId = '') => {
	return await exec(
		cmd, args, {
			cwd: getRepoPath(optRepoId),
		}
	);
};

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

const commitsHistoryParser = (out, line) => {
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
};

module.exports = {
	handleRequest,
	execute,
	getRepoPath,
	spawnCmd,
	commitsHistoryParser,
	getCommitFormat,
};

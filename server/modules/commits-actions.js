const COMMITS_CHUNK = 5;

const HashNotExist = require('../models/responses/hash-not-exist');
const {execute} = require('./utils');

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

const getCommitFormat = () => {
	return `{${ Object
		.keys(FormatKeysMap)
		.map((key) => `"${key}":"${FormatKeysMap[key]}"`)
		.join()}}`;
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
		const {stdout} = await execute(
			'git', [
				'log',
				hash,
				`--skip=${offset}`,
				`--max-count=${limit}`,
				`--pretty="${getCommitFormat()}"`,
			], repoId
		);
		const result = stdout
			.match(/({).{0,}(})/g)
			.map((json) => JSON.parse(json))
			.map(parseCommit);
		return result;
	} catch (error) {
		throw new HashNotExist();
	}
};

const getCommitsList = async (repoId, hash, offset = 0, limit = 2) => {
	return await commits(repoId, hash, offset, limit);
};

module.exports = {
	getCommitsList,
};

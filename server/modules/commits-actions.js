const SEPARATOR = '~!@?';
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
	return Object
		.keys(FormatKeysMap)
		.map((key) => `${key}='${FormatKeysMap[key]}'`)
		.join(' ') + ` ${SEPARATOR}`;
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
	} catch (error) {
		throw new HashNotExist();
	}
};

const getCommitsList = async (repoId, hash, offset = 0, limit = Infinity) => {
	return await commits(repoId, hash, offset, limit);
};

module.exports = {
	getCommitsList,
};

const {getReposList} = require('../modules/repository-actions');

const Actions = {
	READ_REPOS_LIST: 'read-repos-list',
};

const Handers = {};
Handers[Actions.READ_REPOS_LIST] = getReposList;

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

	const data = await promise;

	memo.delete(callId);

	return data;
};

const readReposList = async () => {
	return await execute(Actions.READ_REPOS_LIST);
};

module.exports = {
	readReposList,
};

const {promisify} = require('util');
const path = require('path');
const fs = require('fs');

const axios = require('axios');

const exec = promisify(require('child_process').exec);
const exists = promisify(fs.exists);

const execute = async (cmd, optRepoId) => await exec(cmd, {
	cwd: path.resolve(process.env.PATH_TO_REPOS, `./${optRepoId || ''}`),
});

const getRepoPath = (repoId) =>
	path.resolve(process.env.PATH_TO_REPOS, `./${repoId}`);

const isRemoteRepoExist = async (url) => {
	try {
		const {status} = await axios.get(url);
		return status === 200;
	} catch (error) {
		return false;
	}
};

const isRepoExist = async (repoId) => {
	try {
		return await exists(getRepoPath(repoId));
	} catch (error) {
		return false;
	}
};

const check = async (action, expected, error) => {
	const status = await action();

	if (status !== expected) {
		throw error;
	}
};

const download = async (repoId, url) => {
	try {
		await Promise.all([
			url.includes('http') ?
				check(
					isRemoteRepoExist.bind(null, url),
					true,
					new Error('Invalid url')
				) :	Promise.resolve(),
			check(
				isRepoExist.bind(null, repoId),
				false,
				new Error('The repository already exist')
			),
		]);

		await execute(`git clone ${url} ${repoId}`);
	} catch (error) {
		throw error;
	}
};

module.exports = {
	download,
};

const {promisify} = require('util');
const path = require('path');
const fs = require('fs');

const axios = require('axios');

const exec = promisify(require('child_process').exec);
const exists = promisify(fs.exists);
const readdir = promisify(fs.readdir);

const Response = require('../models/responses/response');
const NotFound = require('../models/responses/not-found');
const AlreadyExist = require('../models/responses/repository-exist');
const NotExist = require('../models/responses/repository-not-exist');

const {PATH_TO_REPOS} = process.env;

const execute = async (cmd, optRepoId = '') => await exec(cmd, {
	cwd: path.resolve(PATH_TO_REPOS, `./${optRepoId}`),
});

const getRepoPath = (repoId) =>	path.resolve(PATH_TO_REPOS, `./${repoId}`);

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
					new NotExist()
				) :	Promise.resolve(),
			check(
				isRepoExist.bind(null, repoId),
				false,
				new AlreadyExist()
			),
		]);

		await execute(`git clone ${url} ${repoId}`);
	} catch (error) {
		throw error instanceof Response ? error : new NotFound();
	}
};

const remove = async (repoId) => {
	try {
		await check(
			isRepoExist.bind(null, repoId),
			true,
			new NotExist()
		);
		await execute(`rm -rf ${repoId}`);
	} catch (error) {
		throw error instanceof Response ? error : new NotFound();
	}
};

const getReposList = async () => {
	const repoIds = await readdir(PATH_TO_REPOS);
	return repoIds.map((id) => ({id}));
};

module.exports = {
	download,
	remove,
	getReposList,
};

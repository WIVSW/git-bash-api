const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const readdir = promisify(fs.readdir);
const exec = promisify(require('child_process').execFile);

const REPOS_PATH = path.resolve(__dirname, '../../../tmp');

const execute = async (cmd, args = [], repoId = '') => {
	return await exec(
		cmd, args, {
			cwd: path.resolve(
				REPOS_PATH,
				repoId ? `./${repoId}` : ''
			),
		}
	);
};

const getAllRepos = async () => await readdir(REPOS_PATH);

const getTestData = () => JSON.parse(process.env.TEST_DATA);

const getFilesList = async (
	repoId = getTestData().REPO_NAMES[0],
	branch = getTestData().BRANCH,
	path = './',
) => {
	const {stdout} = await execute('git', [
		'--no-pager',
		'ls-tree',
		'--name-only',
		`${branch}:${path}`,
	], repoId);

	return stdout
		.split('\n')
		.filter(Boolean);
};

module.exports = {
	getAllRepos,
	getTestData,
	getFilesList,
};

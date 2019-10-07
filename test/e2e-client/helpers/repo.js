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

const findFirstMd = async (repoId, branch) => {
	const files = await getFilesList(repoId, branch);
	return files.filter((file) => file.includes('.md'))[0];
};

const readFile = async (repoId, branch, path) => {
	const {stdout} = await execute('git', [
		'--no-pager',
		'cat-file',
		`${branch}:${path}`,
		'-p',
	], repoId);

	return stdout;
};

const getListItemByType = async (type, repoId, branch, path = './') => {
	const {stdout} = await execute('git', [
		'--no-pager',
		'ls-tree',
		`${branch}:${path}`,
	], repoId);

	const item = stdout
		.split('\n')
		.find((item) => item && item.includes(type));

	return item
		.split('\t')
		.slice(-1)[0];
};

module.exports = {
	getAllRepos,
	getTestData,
	getFilesList,
	findFirstMd,
	readFile,
	getListItemByType,
};

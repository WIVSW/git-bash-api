const {promisify} = require('util');
const {resolve} = require('path');
const fs = require('fs');

const axios = require('axios');

const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

const {execute, getRepoPath} = require('./utils');
const Response = require('../models/responses/response');
const NotFound = require('../models/responses/not-found');
const AlreadyExist = require('../models/responses/repository-exist');
const NotExist = require('../models/responses/repository-not-exist');

const isRemoteRepoExist = async (url) => {
	try {
		const {status} = await axios.get(url);
		return status === 200;
	} catch (error) {
		return false;
	}
};

const isPathExist = async (path) => {
	try {
		await stat(path);
		return true;
	} catch (error) {
		return false;
	}
};

const isRepoExist = async (repoId) => {
	return await isPathExist(getRepoPath(repoId));
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

		await execute('git', ['clone', url, repoId]);
	} catch (error) {
		throw error instanceof Response ? error : new NotFound();
	}
};

const removeRecursive = async (path) => {
	// Вообще в обычной ситуации я бы использовал библиотеку
	// Но мне показалось, что задание направленно на взаимодействие
	// с базовыми модулями node.js, поэтому реализовал сам
	let stats;
	try {
		stats = await stat(path);
	} catch (error) {
		return;
	}

	if (stats.isDirectory()) {
		const files = await readdir(path);
		const pathes = files.map((file) => resolve(path, `./${file}`));

		if (pathes.length) {
			await Promise.all(pathes.map(removeRecursive));
		}

		await rmdir(path);
	} else {
		await unlink(path);
	}
};

const remove = async (repoId) => {
	await check(
		isRepoExist.bind(null, repoId),
		true,
		new NotExist()
	);
	await removeRecursive(getRepoPath(repoId));
};

const getReposList = async () => {
	const repoIds = await readdir(process.env.PATH_TO_REPOS);
	return repoIds.map((id) => ({id}));
};

module.exports = {
	download,
	remove,
	getReposList,
};

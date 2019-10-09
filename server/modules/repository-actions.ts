import { promisify } from 'util';
import fs from 'fs';

import axios from 'axios';

const stat = promisify(fs.stat);

const deps = {
	execute: null,
	readdir: null,
	removeRecursive: null,
};

import { getRepoPath } from './utils';
import Response from '../models/responses/response';
import NotFound from '../models/responses/not-found';
import AlreadyExist from '../models/responses/repository-exist';
import NotExist from '../models/responses/repository-not-exist';

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
	const {execute} = deps;
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

const remove = async (repoId) => {
	const {removeRecursive} = deps;
	await check(
		isRepoExist.bind(null, repoId),
		true,
		new NotExist()
	);
	await removeRecursive(getRepoPath(repoId));
};

const getReposList = async () => {
	const {readdir} = deps;
	const repoIds = await readdir(process.env.PATH_TO_REPOS);
	return repoIds.map((id) => ({id}));
};

module.exports = ({execute, readdir, removeRecursive}) => {
	deps.execute = execute;
	deps.readdir = readdir;
	deps.removeRecursive = removeRecursive;
	return {
		download,
		remove,
		getReposList,
	};
};

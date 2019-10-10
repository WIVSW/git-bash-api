import { promisify } from 'util';
import fs from 'fs';
const stat = promisify(fs.stat);
import axios from 'axios';
import {getRepoPath, IExecResult} from './utils';
import Response from '../models/responses/response';
import NotFound from '../models/responses/not-found';
import AlreadyExist from '../models/responses/repository-exist';
import NotExist from '../models/responses/repository-not-exist';
import Fail from "../models/responses/fail";

const deps : IDeps = {
	execute: void 0,
	readdir: void 0,
	removeRecursive: void 0,
};

export interface IDeps {
	execute?: (cmd: string, args: string[], optRepoId?: string) => Promise<IExecResult> | null,
	readdir?: (path: string) => Promise<string[]>,
	removeRecursive?: (pathToFile: string) => Promise<void>
}

const isRemoteRepoExist = async (url : string) : Promise<boolean> => {
	try {
		const {status} = await axios.get(url);
		return status === 200;
	} catch (error) {
		return false;
	}
};

const isPathExist = async (path : string) : Promise<boolean> => {
	try {
		await stat(path);
		return true;
	} catch (error) {
		return false;
	}
};

const isRepoExist = async (repoId : string) : Promise<boolean> => {
	return await isPathExist(getRepoPath(repoId));
};

const check = async (
	action : () => Promise<boolean>,
	expected : boolean,
	error : Fail
) => {
	const status = await action();

	if (status !== expected) {
		throw error;
	}
};

const download = async (repoId : string, url : string) => {
	try {
		const {execute} = deps;
		if (!execute) {
			throw new NotFound();
		}

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

const remove = async (repoId : string) => {
	try {
		const {removeRecursive} = deps;

		if (!removeRecursive) {
			throw new NotFound();
		}

		await check(
			isRepoExist.bind(null, repoId),
			true,
			new NotExist()
		);
		await removeRecursive(getRepoPath(repoId));
	} catch (error) {
		throw error instanceof Response ? error : new NotFound();
	}
};

export interface IRepo {
	id: string;
}

const getReposList = async () : Promise<IRepo[]> => {
	try {
		const {readdir} = deps;

		if (!readdir) {
			throw new NotFound();
		}

		const repoIds = await readdir(process.env.PATH_TO_REPOS || '');
		return repoIds.map((id) => ({id}));
	} catch (error) {
		throw error instanceof Response ? error : new NotFound();
	}
};

export default ({execute, readdir, removeRecursive} : IDeps) => {
	deps.execute = execute;
	deps.readdir = readdir;
	deps.removeRecursive = removeRecursive;
	return {
		download,
		remove,
		getReposList,
	};
};

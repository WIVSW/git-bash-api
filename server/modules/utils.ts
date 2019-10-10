import { promisify } from 'util';
import path from 'path';
const exec = promisify(require('child_process').execFile);
import { spawn } from 'child_process';
import readline from 'readline';

import fs from 'fs';
export const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

import Response, {Data} from '../models/responses/response';
import Success from '../models/responses/success';
import Unknown from '../models/responses/unknown';
import {Request, Response as ExpressResponse} from "express";

export const handleRequest = async (
	action : (req : Request, res : ExpressResponse) => Promise<Data>,
	req : Request,
	res : ExpressResponse
) : Promise<void> => {
	let response;
	try {
		const data = await action(req, res);
		response = new Success(data);
	} catch (error) {
		response = error instanceof Response ? error : new Unknown();
	}
	const {code, message, data} = response;

	res
		.status(code)
		.send({message, data});
};

const defaultParser = (
	line : string,
	out : string = ''
) : string => `${out}${line}\n`;

export const spawnCmd = async <O>(
	cmd : string,
	args : string[] = [],
	optRepoId : string = '',
	parser: (line: string, out?: O) => O
) : Promise<O> => {
	return new Promise((resolve, reject) => {
		let out : O;
		const child = spawn(cmd, args, {
			cwd: getRepoPath(optRepoId),
		});

		const r1 = readline.createInterface({
			input: child.stdout,
			terminal: false,
		});

		r1.on('line', (line) => {
			out = parser(line, out);
		});

		child.on('error', (error) => {
			reject(error);
		});

		child.on('close', (code) => {
			if (code === 0) {
				resolve(out);
			} else {
				reject(out);
			}
		});
	});
};

export const spawnDefault = async (
	cmd : string,
	args : string[] = [],
	optRepoId : string = '',
) : Promise<string> => await spawnCmd<string>(cmd, args, optRepoId, defaultParser);

export const getRepoPath = (repoId : string) : string =>
	path.resolve(process.env.PATH_TO_REPOS || '', `./${repoId}`);

export interface IExecResult {
	stdout: string;
	stderr: string;
}

export const execute = async (
	cmd : string,
	args : string[] = [],
	optRepoId = ''
) : Promise<IExecResult> => {
	return await exec(
		cmd, args, {
			cwd: getRepoPath(optRepoId),
		}
	);
};

export enum CommitProps {
	HASH_SHORT = 'hash.short',
	HASH_FULL = 'hash.full',
	PARENT_SHORT = 'parent.short',
	PARENT_FULL = 'parent.full',
	TIMESTAMP = 'timestamp',
	AUTHOR = 'author',
	MESSAGE_SUBJECT = 'message.subject',
	MESSAGE_BODY = 'message.body',
};

type CommitPropsMap = {
	[K in CommitProps]: string
}

const FormatKeysMap : CommitPropsMap = {
	[CommitProps.HASH_SHORT]: '%h',
	[CommitProps.HASH_FULL]: '%H',
	[CommitProps.PARENT_SHORT]: '%p',
	[CommitProps.PARENT_FULL]: '%P',
	[CommitProps.TIMESTAMP]: '%ct',
	[CommitProps.AUTHOR]: '%aN',
	[CommitProps.MESSAGE_SUBJECT]: '%s',
	[CommitProps.MESSAGE_BODY]: '%b',
};
FormatKeysMap[CommitProps.HASH_SHORT] = '%h';
FormatKeysMap[CommitProps.HASH_FULL] = '%H';
FormatKeysMap[CommitProps.PARENT_SHORT] = '%p';
FormatKeysMap[CommitProps.PARENT_FULL] = '%P';
FormatKeysMap[CommitProps.TIMESTAMP] = '%ct';
FormatKeysMap[CommitProps.AUTHOR] = '%aN';
FormatKeysMap[CommitProps.MESSAGE_SUBJECT] = '%s';
FormatKeysMap[CommitProps.MESSAGE_BODY] = '%b';

const COMMIT_START : string = `СOMMIT_START`;
const COMMIT_END : string = `COMMIT_END`;
const PROP_START : string = `PROPERTY_START`;
const PROP_END : string = `PROPERTY_END`;

export const getCommitFormat = () : string => {
	return `${COMMIT_START}${ Object
		.values(CommitProps)
		.map((key : CommitProps) : string => `${PROP_START}${key}===${FormatKeysMap[key]}${PROP_END}`)
		.join('')}${COMMIT_END}`;
};

const parseHashes = (hash? : string) : string[] => hash ? hash.split(' ').filter(Boolean) : [];

export interface IHash {
	short: string[];
	full: string[];
}

export interface IMessage {
	subject: string | null;
	body: string | null;
}

export interface ICommit {
	author: string | null;
	hash: IHash;
	parent?: IHash;
	message: IMessage;
	timestamp: number | null;
}

type RawCommit = {
	[K in CommitProps]?: string
}

const parseCommit = (obj: RawCommit) : ICommit => {
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

export interface IHistoryParserOut {
	commits: ICommit[];
	string: string;
}

export const commitsHistoryParser = (
	line : string,
	out : IHistoryParserOut = { commits: [], string: '' }
) => {
	out.string += `${line}\n`;
	const start : number = out.string.indexOf(COMMIT_START);
	const end : number = out.string.lastIndexOf(COMMIT_END);

	if (end !== -1) {
		const commitsProps : string[] = Object.values(CommitProps);
		const row : string = out.string.slice(start, end + COMMIT_END.length);
		const rawCommit : RawCommit = row
			.split(PROP_END)
			.map((prop) => {
				const index = prop.indexOf(PROP_START) + PROP_START.length;
				return prop.slice(index);
			})
			.filter(Boolean)
			.map((prop: string) => {
				let [key, value] = prop.split('===');
				return [key, value || null];
			})
			.reduce((a : {[key: string] : string}, [key, value]) => {
				if (key && value && commitsProps.includes(key)) {
					a[key] = value
				}
				return a;
			}, {});
		out.string = out.string.slice(end + COMMIT_END.length);
		const parsedCommit : ICommit = parseCommit(rawCommit);
		out.commits.push(parsedCommit);
	}

	return out;
};

export const spawnHistory = async (
	cmd : string,
	args : string[] = [],
	optRepoId : string = '',
) : Promise<IHistoryParserOut> => await spawnCmd<IHistoryParserOut>(cmd, args, optRepoId, commitsHistoryParser);

export const removeRecursive = async (pathToFile: string) : Promise<void> => {
	// Вообще в обычной ситуации я бы использовал библиотеку
	// Но мне показалось, что задание направленно на взаимодействие
	// с базовыми модулями node.js, поэтому реализовал сам
	let stats;
	try {
		stats = await stat(pathToFile);
	} catch (error) {
		return;
	}

	if (stats.isDirectory()) {
		const files = await readdir(pathToFile);
		const pathes = files.map((file) => path.resolve(pathToFile, `./${file}`));

		if (pathes.length) {
			await Promise.all(pathes.map(removeRecursive));
		}

		await rmdir(pathToFile);
	} else {
		await unlink(pathToFile);
	}
};

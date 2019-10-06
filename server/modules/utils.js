const {promisify} = require('util');
const {resolve} = require('path');
const exec = promisify(require('child_process').execFile);
const {spawn} = require('child_process');
const readline = require('readline');

const Response = require('../models/responses/response');
const Success = require('../models/responses/success');
const Unknown = require('../models/responses/unknown');

const handleRequest = async (action, req, res, ...rest) => {
	let response;
	try {
		const data = await action(req, res, ...rest);
		response = new Success(data);
	} catch (error) {
		response = error instanceof Response ? error : new Unknown();
	}
	const {code, message, data} = response;

	res
		.status(code)
		.send({message, data});
};

const spawnCmd = async (cmd, args = [], optRepoId = '', optParser) => {
	const defaultParser = (out, line) => {
		if (!out) {
			out = '';
		}

		return `${out}${line}\n`;
	};
	const parser = typeof optParser !== 'undefined' ? optParser : defaultParser;
	return new Promise((resolve, reject) => {
		let out;
		const child = spawn(cmd, args, {
			cwd: getRepoPath(optRepoId),
		});

		const r1 = readline.createInterface({
			input: child.stdout,
			terminal: false,
		});

		r1.on('line', function(line) {
			out = parser(out, line);
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

const getRepoPath = (repoId) =>
	resolve(process.env.PATH_TO_REPOS, `./${repoId}`);

const execute = async (cmd, args = [], optRepoId = '') => {
	return await exec(
		cmd, args, {
			cwd: getRepoPath(optRepoId),
		}
	);
};

module.exports = {
	handleRequest,
	execute,
	getRepoPath,
	spawnCmd,
};

const {promisify} = require('util');
const {resolve} = require('path');
const exec = promisify(require('child_process').execFile);

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
};

const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const exists = promisify(fs.exists);
const {download} = require('../modules/repository-actions');

const isRepoExist = async (repoId) => {
	const repoPath = path.resolve(process.env.PATH_TO_REPOS, `./${repoId}`);
	try {
		return await exists(repoPath);
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

router.post('/', async (req, res) => {
	const {repositoryId, body: {url}} = req;
	try {
		await download(repositoryId, url);
		res
			.status(200)
			.send({message: 'OK', data: [{
				id: repositoryId,
			}]});
	} catch (error) {
		res
			.status(404)
			.send({message: 'Not found', data: null});
	}
});

router.delete('/', async (req, res) => {
	const {repositoryId} = req;
	try {
		await check(
			isRepoExist.bind(null, repositoryId),
			true,
			new Error('The repository not exist')
		);
		await exec(
			`rm -rf ${repositoryId}`,
			{
				cwd: process.env.PATH_TO_REPOS,
			}
		);
		res
			.status(200)
			.send({message: 'OK', data: [{
				id: repositoryId,
			}]});
	} catch (error) {
		res
			.status(404)
			.send({message: 'Not found', data: null});
	}
});

module.exports = router;

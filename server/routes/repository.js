const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	const {repositoryId, body: {url}} = req;
	try {
		await exec(
			`cd ${process.env.PATH_TO_REPOS} && git clone ${url} ${repositoryId}`
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

router.delete('/', async (req, res) => {
	const {repositoryId} = req;
	try {
		await exec(
			`cd ${process.env.PATH_TO_REPOS} && rm -rf ${repositoryId}`
		);
		res
			.status(200)
			.send({message: 'OK', data: [{
				id: repositoryId,
			}]});
	} catch (error) {
		res
			.status(400)
			.send({message: 'Not found', data: null});
	}
});

module.exports = router;

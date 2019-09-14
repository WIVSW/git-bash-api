const express = require('express');
const router = express.Router();

const {download, remove} = require('../modules/repository-actions');

const Response = require('../models/responses/response');
const UnknownFail = require('../models/responses/unknown');

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
		const fail = error instanceof Response ? error : new UnknownFail();
		const {message, data} = fail;
		res
			.status(fail.code)
			.send({message, data});
	}
});

router.delete('/', async (req, res) => {
	const {repositoryId} = req;
	try {
		await remove(repositoryId);

		res
			.status(200)
			.send({message: 'OK', data: [{
				id: repositoryId,
			}]});
	} catch (error) {
		const fail = error instanceof Response ? error : new UnknownFail();
		const {message, data} = fail;
		res
			.status(fail.code)
			.send({message, data});
	}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const {download, remove} = require('../modules/repository-actions');

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
		await remove(repositoryId);

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

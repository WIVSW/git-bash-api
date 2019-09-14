const express = require('express');
const router = express.Router();

const {download, remove} = require('../modules/repository-actions');
const {handleRequest} = require('../modules/utils');

router.post('/', handleRequest.bind(null, async (req) => {
	const {repositoryId: id, body: {url}} = req;
	await download(id, url);
	return [{id}];
}));

router.delete('/', handleRequest.bind(null, async (req) => {
	const {repositoryId: id} = req;
	await remove(id);
	return [{id}];
}));

module.exports = router;

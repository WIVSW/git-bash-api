const express = require('express');
const router = express.Router();

const {listDir} = require('../modules/actions');
const {handleRequest} = require('../modules/utils');

router.get('*', handleRequest.bind(null, async (req) => {
	const path = req.params[0].slice(1);
	return await listDir(req.repositoryId, req.hash, path);
}));

module.exports = router;

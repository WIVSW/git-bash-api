const express = require('express');
const router = express.Router();

const {handleRequest} = require('../modules/utils');

router.get('*', handleRequest.bind(null, async (req) => {
	const path = req.params[0].slice(1);
	console.log(req.repositoryId, req.hash, path, req.params);
	return [];
}));

module.exports = router;

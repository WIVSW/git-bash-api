const express = require('express');
const router = express.Router();

const {readCommitsList} = require('../modules/actions');
const {handleRequest} = require('../modules/utils');

router.get('/', handleRequest.bind(null, async (req) => {
	const {repositoryId, hash} = req;
	return await readCommitsList(repositoryId, hash);
}));

module.exports = router;

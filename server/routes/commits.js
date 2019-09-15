const express = require('express');
const router = express.Router();

const {readCommitsList, readCommitDiff} = require('../modules/actions');
const {handleRequest} = require('../modules/utils');

router.get('/', handleRequest.bind(null, async (req) => {
	const {repositoryId, hash} = req;
	return await readCommitsList(repositoryId, hash);
}));

router.get('/offset/:offset/limit/:limit',
	handleRequest.bind(null, async (req) => {
		const {repositoryId, hash} = req;
		const {offset, limit} = req.params;
		return await readCommitsList(repositoryId, hash, offset, limit);
	})
);

router.get('/diff', handleRequest.bind(null, async (req) => {
	const {repositoryId, hash} = req;
	return await readCommitDiff(repositoryId, hash);
}));

module.exports = router;

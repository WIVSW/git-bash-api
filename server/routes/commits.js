const express = require('express');
const router = express.Router();

const {handleRequest} = require('../modules/utils');

const deps = {
	actions: null,
};

router.get('/', handleRequest.bind(null, async (req) => {
	const {repositoryId, hash} = req;
	return await deps.actions.readCommitsList(repositoryId, hash);
}));

router.get('/offset/:offset/limit/:limit',
	handleRequest.bind(null, async (req) => {
		const {repositoryId, hash} = req;
		const {offset, limit} = req.params;
		return await deps.actions
			.readCommitsList(repositoryId, hash, offset, limit);
	})
);

router.get('/diff', handleRequest.bind(null, async (req) => {
	const {repositoryId, hash} = req;
	return await deps.actions.readCommitDiff(repositoryId, hash);
}));

module.exports = ({actions}) => {
	deps.actions = actions;
	return router;
};

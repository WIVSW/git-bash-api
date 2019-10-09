import express from 'express';
const router = express.Router();

import { handleRequest } from '../modules/utils';

const deps = {
	actions: null,
};

router.get('*', handleRequest.bind(null, async (req) => {
	const path = req.params[0].slice(1);
	return await deps.actions.readBlob(req.repositoryId, req.hash, path);
}));

module.exports = ({actions}) => {
	deps.actions = actions;
	return router;
};

import express from 'express';
const router = express.Router();

import parseCommitHash from '../middleware/parse-commit-hash';
import { handleRequest } from '../modules/utils';


const deps = {
	actions: null,
	commitsRoute: null,
	filesRoute: null,
	blobRoute: null,
};

router.get('/', (req, res) => {
	res.redirect(`/api/repos/${req.repositoryId}/tree/master`);
});

router.post('/', handleRequest.bind(null, async (req) => {
	const {repositoryId: id, body: {url}} = req;
	await deps.actions.downloadRepo(id, url);
	return [{id}];
}));

router.delete('/', handleRequest.bind(null, async (req) => {
	const {repositoryId: id} = req;
	await deps.actions.removeRepo(id);
	return [{id}];
}));

router.use('/commits/:hash/',
	parseCommitHash, (...args) => deps.commitsRoute(...args));

router.use('/tree/:hash',
	parseCommitHash, (...args) => deps.filesRoute(...args));

router.use('/blob/:hash',
	parseCommitHash, (...args) => deps.blobRoute(...args));

module.exports = ({
	actions,
	commitsRoute,
	filesRoute,
	blobRoute,
}) => {
	deps.actions = actions;
	deps.commitsRoute = commitsRoute;
	deps.filesRoute = filesRoute;
	deps.blobRoute = blobRoute;
	return router;
};

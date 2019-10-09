import express from 'express';
import parseRepoId from '../middleware/parse-repository-id';
import { handleRequest } from '../modules/utils';

const deps = {
	actions: null,
	repoRoute: null,
};

const router = express.Router();

router.get('/repos/',
	handleRequest.bind(null, (...args) => deps.actions.readReposList(...args)));

router.use('/repos/:repositoryId/',
	parseRepoId, (...args) => deps.repoRoute(...args));

module.exports = ({actions, repoRoute}) => {
	deps.actions = actions;
	deps.repoRoute = repoRoute;
	return router;
};

import express, {NextFunction, Response} from 'express';
import parseRepoId from '../middleware/parse-repository-id';
import { handleRequest } from '../modules/utils';
import {IActionsContainer} from "../modules/actions";
import {IRepo} from "../modules/repository-actions";
import NotFound from "../models/responses/not-found";

interface IDeps {
	actions?: IActionsContainer;
	repoRoute?: Express.Router;
}

const deps : IDeps = {
	actions: void 0,
	repoRoute: void 0,
};

// @ts-ignore TODO: разобраться в том как переопределить express Router
const router : Express.Router = express.Router();

router.get('/repos/',	handleRequest<IRepo[]>(async () => {
	if (!deps.actions) {
		throw new NotFound();
	}

	return await deps.actions.readReposList();
}));

router.use('/repos/:repositoryId/',	parseRepoId, (
	req : Express.Request,
	res: Response,
	next : NextFunction
) => {
	if (!deps.repoRoute) {
		throw new NotFound();
	}

	return deps.repoRoute(req, res, next)
});

export default ({actions, repoRoute} : IDeps) => {
	deps.actions = actions;
	deps.repoRoute = repoRoute;
	return router;
};

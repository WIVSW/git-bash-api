import express, {NextFunction, Response} from 'express';
// @ts-ignore TODO: разобраться в том как переопределить express Router
const router : Express.Router = express.Router();

import parseCommitHash from '../middleware/parse-commit-hash';
import { handleRequest } from '../modules/utils';
import {IActionsContainer} from "../modules/actions";
import NotFound from "../models/responses/not-found";


interface IDeps {
	actions?: IActionsContainer;
	commitsRoute?: Express.Router,
	filesRoute?: Express.Router,
	blobRoute?: Express.Router,
}

const deps : IDeps = {
	actions: void 0,
	commitsRoute: void 0,
	filesRoute: void 0,
	blobRoute: void 0,
};

router.get('/', (req : Express.Request, res : Response) => {
	res.redirect(`/api/repos/${req.repositoryId}/tree/master`);
});

router.post('/', handleRequest(async (req) => {
	const {repositoryId: id, body: {url}} = req;
	if (!deps.actions) {
		throw new NotFound();
	}

	await deps.actions.downloadRepo(id, url);
	return [{id}];
}));

router.delete('/', handleRequest(async (req) => {
	const {repositoryId: id} = req;
	if (!deps.actions) {
		throw new NotFound();
	}

	await deps.actions.removeRepo(id);
	return [{id}];
}));

router.use('/commits/:hash/', parseCommitHash, (
	req : Express.Request,
    res: Response,
    next : NextFunction
) => {
	if (!deps.commitsRoute) {
		throw new NotFound();
	}

	return deps.commitsRoute(req, res, next);
});

router.use('/tree/:hash', parseCommitHash, (
	req : Express.Request,
	res: Response,
	next : NextFunction
) => {
	if (!deps.filesRoute) {
		throw new NotFound();
	}

	return deps.filesRoute(req, res, next);
});

router.use('/blob/:hash', parseCommitHash, (
	req : Express.Request,
	res: Response,
	next : NextFunction
) => {
	if (!deps.blobRoute) {
		throw new NotFound();
	}

	return deps.blobRoute(req, res, next);
});

export default ({
	actions,
	commitsRoute,
	filesRoute,
	blobRoute,
} : IDeps) => {
	deps.actions = actions;
	deps.commitsRoute = commitsRoute;
	deps.filesRoute = filesRoute;
	deps.blobRoute = blobRoute;
	return router;
};

import express from 'express';
// @ts-ignore TODO: разобраться в том как переопределить express Router
const router : Express.Router = express.Router();

import {handleRequest, ICommit} from '../modules/utils';
import {IActionsContainer} from "../modules/actions";
import NotFound from "../models/responses/not-found";

interface IDeps {
	actions?: IActionsContainer
}

const deps : IDeps = {
	actions: void 0,
};

router.get('/', handleRequest<ICommit[]>(async (req : Express.Request) => {
	const {repositoryId, hash} = req;
	if (!deps.actions) {
		throw new NotFound();
	}
	return await deps.actions.readCommitsList(repositoryId, hash);
}));

router.get('/offset/:offset/limit/:limit',
	handleRequest<ICommit[]>(async (req: Express.Request) => {
		const {repositoryId, hash} = req;
		const {offset, limit} = req.params;
		if (!deps.actions) {
			throw new NotFound();
		}

		return await deps.actions
			.readCommitsList(repositoryId, hash, offset, limit);
	})
);

router.get('/diff', handleRequest<string>(async (req: Express.Request) => {
	const {repositoryId, hash} = req;
	if (!deps.actions) {
		throw new NotFound();
	}

	return await deps.actions.readCommitDiff(repositoryId, hash);
}));

router.get('/diff', handleRequest<string>(async (req: Express.Request) => {
	const {repositoryId, hash} = req;
	if (!deps.actions) {
		throw new NotFound();
	}

	return await deps.actions.readCommitDiff(repositoryId, hash);
}));

export default ({actions} : IDeps) => {
	deps.actions = actions;
	return router;
};

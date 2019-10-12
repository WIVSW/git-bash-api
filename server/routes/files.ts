import express from 'express';
// @ts-ignore TODO: разобраться в том как переопределить express Router
const router : Express.Router = express.Router();

import { handleRequest } from '../modules/utils';
import {IActionsContainer} from "../modules/actions";
import NotFound from "../models/responses/not-found";

interface IDeps {
	actions?: IActionsContainer
}

const deps : IDeps = {
	actions: void 0,
};

router.get('*', handleRequest(async (req) => {
	// @ts-ignore
	const path = req.params[0].slice(1);

	if (!deps.actions) {
		throw new NotFound();
	}

	return await deps.actions.listDir(req.repositoryId, req.hash, path);
}));

export default ({actions} : IDeps) => {
	deps.actions = actions;
	return router;
};

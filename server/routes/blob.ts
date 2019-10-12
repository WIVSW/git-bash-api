import express from 'express';
// @ts-ignore TODO: разобраться в том как переопределить express Router
const router : Express.Router = express.Router();

import { handleRequest } from '../modules/utils';
import {IActionsContainer} from "../modules/actions";
import NotFound from "../models/responses/not-found";
import parsePath from '../middleware/parse-path';

interface IDeps {
	actions?: IActionsContainer
}

const deps : IDeps = {
	actions: void 0,
};

router.get('*', parsePath, handleRequest(async (req) => {
	if (!deps.actions) {
		throw new NotFound();
	}

	return await deps.actions.readBlob(req.repositoryId, req.hash, req.pathToFile);
}));

export default ({actions} : IDeps) => {
	deps.actions = actions;
	return router;
};

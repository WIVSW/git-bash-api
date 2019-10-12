import {Request, Response, NextFunction, ParamsDictionary} from 'express-serve-static-core';

export interface IRepoReq extends Request<ParamsDictionary> {
	repositoryId: string;
}

export default (req : IRepoReq, res : Response, next: NextFunction) => {
	req.repositoryId = req.params.repositoryId;

	next();
};

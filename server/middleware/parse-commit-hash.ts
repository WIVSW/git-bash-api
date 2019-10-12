import {Response, NextFunction, Response as ExpressResponse} from 'express-serve-static-core';
import {IRepoReq} from "./parse-repository-id";

export interface IHashReq extends IRepoReq {
	hash: string;
}

export type RequestAction<R, P> = (req : R, res : ExpressResponse, next: NextFunction) => Promise<P>

export default (req : IHashReq, res : Response, next: NextFunction) => {
	req.hash = req.params.hash;

	next();
};

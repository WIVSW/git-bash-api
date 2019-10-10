import {NextFunction, Request, Response} from "express";

interface Req extends Request {
	repositoryId: string;
}

export default (req : Req, res : Response, next: NextFunction) => {
	req.repositoryId = req.params.repositoryId;

	next();
};

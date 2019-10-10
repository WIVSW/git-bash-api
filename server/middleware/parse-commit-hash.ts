import {NextFunction, Request, Response} from "express";

interface Req extends Request {
	hash: string;
}

export default (req : Req, res : Response, next: NextFunction) => {
	req.hash = req.params.hash;

	next();
};

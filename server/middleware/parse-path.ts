import {NextFunction, Response} from "express-serve-static-core";
import {IHashReq} from "./parse-commit-hash";

export interface IPathReq extends IHashReq{
	pathToFile: string
}

export default (req : IPathReq, res : Response, next: NextFunction) => {
	let pathToFile : string = req.params[0].slice(1) || '';
	req.pathToFile = pathToFile;

	next();
};
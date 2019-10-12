import {RouterOptions} from "express";
import {
	Application,
	NextFunction,
	RequestHandler,
	Params,
	ParamsDictionary,
	Request as CoreRequest,
	PathParams, RequestHandlerParams,
	Response as ExpressResponse, default as core
} from "express-serve-static-core";

export interface IParams {
	limit?: number;
	offset?: number;
}

declare global {
	namespace Express {
		export interface Request {
			repositoryId: string;
			hash: string;
			params: IParams;
		}

		export function Router(options?: RouterOptions): Express.Router;
		export interface Router extends Express.IRouter {}
		export interface IRouter extends RHanler {
			get: Express.IRouterMatcher<this>;
		}

		export interface IRouterMatcher<T> {
			// tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
			<P extends Params = ParamsDictionary>(path: PathParams, ...handlers: Array<RHanler<P>>): T;
			// tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
			<P extends Params = ParamsDictionary>(path: PathParams, ...handlers: Array<RequestHandlerParams<P>>): T;
			(path: PathParams, subApplication: Application): T;
		}
	}
}

export interface RHanler<P extends Params = ParamsDictionary> extends RequestHandler<P> {
	// tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2
	(req: Express.Request, res: ExpressResponse, next: NextFunction): any;
}
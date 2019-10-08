import Connection, {Data} from '../module/connection';
import {Method} from 'axios';

class Api {
	private _connection : Connection;

	constructor(connection : Connection) {
		this._connection  = connection;
	}

	protected async _request(
		url : string,
		method?: Method,
		postData? : object
	) : Promise<Data> {
		return await this._connection.request(url, method, postData);
	}

	protected _uri(string : string) : string {
		return encodeURIComponent(string);
	}
}

export default Api;

import Connection from '../module/connection';
import {Method} from 'axios';

class Api {
	private _connection : Connection;

	constructor(connection : Connection) {
		this._connection  = connection;
	}

	protected async _request<T>(
		url : string,
		method?: Method,
		postData? : object
	) : Promise<T> {
		const {data : T} = await this._connection.request(url, method, postData);

		return data;
	}

	protected _uri(string : string) : string {
		return encodeURIComponent(string);
	}
}

export default Api;

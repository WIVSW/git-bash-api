import axios, {AxiosInstance, AxiosRequestConfig, Method} from 'axios';

export type Data = object | object[];

class Connection {
	private _fetcher : AxiosInstance;

	constructor() {
		this._fetcher = axios.create({
			baseURL: '/api/',
			timeout: 30 * 1000,
		});
	}

	async request(
		url : string,
		method : Method = 'get',
		postData? : object
	) : Promise<Data> {
		const options : AxiosRequestConfig = {
			method,
			url,
		};

		if (postData) {
			options.data = postData;
		}

		let data;
		try {
			const response = await this._fetcher.request(options);
			data = response.data;
		} catch (e) {
			throw e.response && e.response.data;
		}

		if (!data) {
			throw new Error(`Request Failed!`);
		}

		return data.data;
	}
}

export default Connection;

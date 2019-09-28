import axios from 'axios';

/**
 */
class Connection {
	/**
	 */
	constructor() {
		/**
		 * @type {AxiosInstance}
		 * @private
		 */
		this._fetcher = axios.create({
			baseURL: '/api/',
			timeout: 30 * 1000,
		});
	}

	/**
	 * @param {string} url
	 * @param {string} method
	 * @param {?Object} postData
	 * @return {Promise<Object>}
	 */
	async request(url, method = 'get', postData) {
		const options = {
			method,
			url,
		};

		if (postData) {
			options.data = postData;
		}

		const {data} = await this._fetcher.request(options);

		if (!data) {
			throw new Error(`Request Failed!`);
		}

		return data;
	}
}

export default Connection;

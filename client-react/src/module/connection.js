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
	 * @param {string=} method
	 * @param {Object=} postData
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
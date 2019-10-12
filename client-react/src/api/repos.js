import Api from './api';
import Repo from '../model/repo';

/**
 */
class ReposApi extends Api {
	/**
	 * @return {Promise<Array<Repo>>}
	 */
	async getRepos() {
		const datas = await this._request('/repos/');
		return datas.map((data) => new Repo(data));
	}
}


export default ReposApi;

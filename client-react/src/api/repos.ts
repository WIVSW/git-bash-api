import Api from './api';
import Repo, {IRepo} from '../model/repo';

class ReposApi extends Api {
	async getRepos() : Promise<Repo[]> {
		const datas = await this._request<IRepo[]>('/repos/');
		return datas.map((data : IRepo) => new Repo(data));
	}
}


export default ReposApi;

/**
 */
class Actions {
	/**
	 * @param {Store} store
	 * @param {Object<Api>} api
	 */
	constructor(store, api) {
		/**
		 * @type {Store}
		 * @private
		 */
		this._store = store;

		/**
		 * @type {ReposApi}
		 * @private
		 */
		this._apiRepos = api.repos;

		/**
		 * @type {CommitsApi}
		 * @private
		 */
		this._apiCommits = api.commits;
	}

	loadTrees(repoId = 'react', pattern) {
		this._store.dispatch((dispatch, getState) => {
			return this._apiCommits
				.getTrees(repoId, pattern)
				.catch(() => ([]))
				.then((trees) => dispatch({
					type: 'LOAD_TREES',
					payload: trees,
				}));
		});
	}

}

export default Actions;

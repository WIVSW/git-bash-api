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

	/**
	 * @param {string=} repoId
	 * @param {string=} pattern
	 */
	loadTrees(repoId, pattern) {
		this._store.dispatch(async (dispatch, getState) => {
			repoId = repoId || getState().repos[0].id;
			let trees = null;
			try {
				trees = await this._apiCommits.getTrees(repoId, pattern);
			} catch (error) {
				trees = [];
			}

			dispatch({
				type: 'LOAD_TREES',
				payload: trees,
			});
		});
	}

	/**
	 */
	loadRepos() {
		this._store.dispatch(async (dispatch, getState) => {
			let repos = null;
			try {
				repos = await this._apiRepos.getRepos();
			} catch (error) {
				repos = [];
			}

			dispatch({
				type: 'LOAD_REPOS',
				payload: repos,
			});
		});
	}
}

export default Actions;

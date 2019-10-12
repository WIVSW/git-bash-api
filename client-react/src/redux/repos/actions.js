
import api from "../../api";

/**
 * @enum {string}
 */
export const ReposActions = {
	LOAD: 'REPOS_LOAD',
	SELECT: 'REPOS_SELECT',
	LOAD_FILES: 'REPOS_LOAD_FILES'
};

export const load = () => ({
	type: ReposActions.LOAD,
	payload: async () => await api.repos.getRepos()
});

export const loadFiles = (repoId, hash = 'master', path = '') => ({
	type: ReposActions.LOAD_FILES,
	payload: async () => {
		const trees = await api.commits.getTrees(repoId, '', hash, path);
		return {
			repoId,
			path,
			trees,
		};
	}
});

export const selectRepo = (repoId) => ({
	type: ReposActions.SELECT,
	payload: repoId
});

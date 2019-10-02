
import api from "../../api";

/**
 * @enum {string}
 */
export const ReposActions = {
	LOAD: 'REPOS_LOAD',
	SELECT: 'REPOS_SELECT'
};

export const load = () => ({
	type: ReposActions.LOAD,
	payload: async () => await api.repos.getRepos()
});

export const selectRepo = (repoId) => ({
	type: ReposActions.SELECT,
	payload: repoId
});

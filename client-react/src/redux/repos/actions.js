
import api from "../../api";

/**
 * @enum {string}
 */
export const ReposActions = {
	LOAD: 'REPOS_LOAD',
};

export const load = () => ({
	type: ReposActions.LOAD,
	payload: async () => await api.repos.getRepos()
});

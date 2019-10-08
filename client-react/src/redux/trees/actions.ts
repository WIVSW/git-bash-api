import api from '../../api';
import {IAction} from '../actions';
import {ITree} from '../../api/commits'
import TreeChunk from "../../model/tree-chunk";

export enum TreeActions {
	LOAD_FILES = 'REPOS_LOAD_FILES'
};

export const loadFiles = (
	repoId : string,
	hash : string = 'master',
	path : string = ''
) : IAction<TreeActions, () => Promise<TreeChunk>> => ({
	type: TreeActions.LOAD_FILES,
	payload: async () : Promise<TreeChunk> => {
		const trees : ITree[] = await api.commits.getTrees(repoId, '', hash, path);
		return new TreeChunk({
			repoId,
			path,
			trees,
		});
	}
});

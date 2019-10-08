import api from '../../api';
import {IAction} from '../actions';
import Repo from "../../model/repo";
import {ITree} from '../../api/commits'
import TreeChunk from "../../model/tree-chunk";

export enum ReposActions {
	LOAD = 'REPOS_LOAD',
	SELECT = 'REPOS_SELECT',
};

export interface IReposPayload {
	items: Repo[];
	selected: string;
};

export const load = () : IAction<ReposActions, () => Promise<IReposPayload>> => ({
	type: ReposActions.LOAD,
	payload: async () : Promise<IReposPayload> => {
		const items = await api.repos.getRepos();
		return { items, selected: items[0].id };
	}
});

export const selectRepo = (repoId : string) : IAction<ReposActions, IReposPayload> => ({
	type: ReposActions.SELECT,
	payload: {
		items: [],
		selected: repoId
	}
});

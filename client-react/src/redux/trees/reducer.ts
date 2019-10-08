import {ActionType} from 'redux-promise-middleware';
import {TreeActions} from './actions';
import {ITree} from "../../api/commits";
import {IAction} from "../actions";
import {IResponse} from "../../module/connection";
import TreeChunk from "../../model/tree-chunk";

const {isArray} = Array;

export interface ITreesState {
	trees: { [key: string]: { [key: string]: ITree[] } };
	filesLoading: boolean;
	loadingError: string | null;
}

const INITIAL_STATE : ITreesState = {
	trees: {},
	filesLoading: false,
	loadingError: null,
};

export type TreeChunkAction = IAction<string, IResponse<TreeChunk>> | IAction<string, TreeChunk>;

export default (state : ITreesState = INITIAL_STATE, action : TreeChunkAction) => {
	switch (action.type) {
		case `${TreeActions.LOAD_FILES}_${ActionType.Pending}`:
			return {
				...state,
				filesLoading: true,
				loadingError: null,
			};
		case `${TreeActions.LOAD_FILES}_${ActionType.Rejected}`:
			let loadingError = null;

			if (!(action.payload instanceof TreeChunk)) {
				loadingError = action.payload.message;
			}
			return {
				...state,
				filesLoading: false,
				loadingError,
			};
		case `${TreeActions.LOAD_FILES}_${ActionType.Fulfilled}`:
			const newTrees : { [key: string] : { [key: string]: ITree[] } } = {
				...state.trees,
			};
			if (action.payload instanceof TreeChunk) {
				const {repoId, path, trees} = action.payload;
				const cached : { [key: string]: ITree[]} = state.trees[repoId] || {};
				const newCached = Object
					.keys(cached)
					.slice(-3)
					.reduce((a : { [key: string]: ITree[] }, b : string) => {
						a[b] = cached[b];
						return a;
					}, {});
				newTrees[repoId] = {
					...newCached,
					[path]: trees
				};
			}
			return {
				...state,
				trees: newTrees,
				filesLoading: false,
				loadingError: null,
			};
		default:
			return state;
	}
}
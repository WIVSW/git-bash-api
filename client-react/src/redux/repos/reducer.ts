import {ActionType} from 'redux-promise-middleware';
import {IReposPayload, ReposActions} from './actions';
import Repo from "../../model/repo";
import {IAction} from "../actions";

export interface IReposState {
	items: Repo[];
	selected: string;
}

const INITIAL_STATE : IReposPayload = {
	items: [],
	selected: ''
};

export type RepoAction = IAction<string, Repo[]> | IAction<string, string>;

export default (state : IReposState = INITIAL_STATE, action : IAction<string, IReposPayload>) => {
	switch (action.type) {
		case `${ReposActions.LOAD}_${ActionType.Fulfilled}`:
			const {payload} = action;
			let selected = null;

			if (state.selected) {
				selected = state.selected;
			} else if (payload.selected) {
				selected = payload.selected;
			} else {
				selected = '';
			}

			return {
				...state,
				items: payload.items,
				selected,
			};
		case ReposActions.SELECT:
			return {
				...state,
				selected: action.payload.selected
			};
		default:
			return state;
	}
}
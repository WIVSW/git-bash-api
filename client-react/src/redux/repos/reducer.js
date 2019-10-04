import {ActionType} from 'redux-promise-middleware';
import {ReposActions} from './actions';

const INITIAL_STATE = {
	items: [],
	trees: {},
	selected: null,
	filesLoading: false,
	loadingError: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case `${ReposActions.LOAD_FILES}_${ActionType.Pending}`:
			return {
				...state,
				filesLoading: true,
				loadingError: null,
			};
		case `${ReposActions.LOAD_FILES}_${ActionType.Rejected}`:
			return {
				...state,
				filesLoading: false,
				loadingError: action.payload && action.payload.message
			};
		case `${ReposActions.LOAD_FILES}_${ActionType.Fulfilled}`:
			const {repoId, path, trees} = action.payload;
			const cached = state.trees[repoId] || {};
			const newCached = Object
				.keys(cached)
				.slice(-3)
				.reduce((a, b) => {
					a[b] = cached[b];
					return a;
				}, {});
			const newTrees = {
				...state.trees,
				[repoId]: {
					...newCached,
					[path]: trees
				}
			};
			return {
				...state,
				trees: newTrees,
				filesLoading: false,
				loadingError: null,
			};
		case `${ReposActions.LOAD}_${ActionType.Fulfilled}`:
			const {payload} = action;
			const selected = state.selected ||
				(payload[0] && payload[0].id) || null;
			return {
				...state,
				items: payload,
				selected,
			};
		case ReposActions.SELECT:
			return {
				...state,
				selected: action.payload
			};
		default:
			return state;
	}
}
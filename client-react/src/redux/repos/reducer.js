import {ActionType} from 'redux-promise-middleware';
import {ReposActions} from './actions';

const INITIAL_STATE = {
	items: [],
	selected: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case `${ReposActions.LOAD}_${ActionType.Fulfilled}`:
			return {
				...state,
				items: action.payload
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
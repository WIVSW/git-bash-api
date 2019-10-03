import {ActionType} from 'redux-promise-middleware';
import {ReposActions} from './actions';

const INITIAL_STATE = {
	items: [],
	selected: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case `${ReposActions.LOAD}_${ActionType.Fulfilled}`:
			const {payload} = action;
			const selected = state.selected ||
				(payload[0] && payload[0].id) || null;
			return {
				...state,
				selected,
				items: payload
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
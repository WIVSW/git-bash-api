import {ActionType} from 'redux-promise-middleware';
import {ReposActions} from './actions';

const INITIAL_STATE = {
	items: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case `${ReposActions.LOAD}_${ActionType.Fulfilled}`:
			return {
				...state,
				items: action.payload
			};
		default:
			return state;
	}
}
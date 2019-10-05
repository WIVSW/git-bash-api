import {ActionType} from 'redux-promise-middleware';
import {FilesActions} from './actions';

const INITIAL_STATE = {
	blobs: {},
	loadingBlob: false,
	loadingBlobError: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case `${FilesActions.LOAD_BLOB}_${ActionType.Pending}`:
			return {
				...state,
				loadingBlob: true,
				loadingBlobError: null,
			};
		case `${FilesActions.LOAD_BLOB}_${ActionType.Rejected}`:
			return {
				...state,
				loadingBlob: false,
				loadingBlobError: action.payload && action.payload.message
			};
		case `${FilesActions.LOAD_BLOB}_${ActionType.Fulfilled}`:
			const newBlobs = Object
				.keys(state.blobs)
				.slice(-5)
				.reduce((obj, blobId) => {
					obj[blobId] = state.blobs[blobId];
					return obj;
				}, {});

			newBlobs[action.payload.id] = action.payload;
			return {
				...state,
				blobs: newBlobs,
				loadingBlob: false,
				loadingBlobError: null,
			};
		default:
			return state;
	}
}
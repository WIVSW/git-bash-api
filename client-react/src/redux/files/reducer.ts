import {ActionType} from 'redux-promise-middleware';
import {FilesActions} from './actions';
import {IAction} from "../actions";
import Blob from "../../model/blob";
import {IResponse} from "../../module/connection";

export interface IBlobState {
	blobs: { [key: string]: Blob };
	loadingBlob: boolean;
	loadingBlobError: string | null
}

const INITIAL_STATE : IBlobState = {
	blobs: {},
	loadingBlob: false,
	loadingBlobError: null,
};

export type BlobAction = IAction<string, Blob> | IAction<string, IResponse<Blob>>;

export default (state : IBlobState = INITIAL_STATE, action : BlobAction) => {
	switch (action.type) {
		case `${FilesActions.LOAD_BLOB}_${ActionType.Pending}`:
			return {
				...state,
				loadingBlob: true,
				loadingBlobError: null,
			};
		case `${FilesActions.LOAD_BLOB}_${ActionType.Rejected}`:
			let loadingBlobError = null;

			if (
				!(action.payload instanceof Blob) &&
				action.payload && action.payload.message
			) {
				loadingBlobError = action.payload.message;
			}
			return {
				...state,
				loadingBlob: false,
				loadingBlobError,
			};
		case `${FilesActions.LOAD_BLOB}_${ActionType.Fulfilled}`:
			const newBlobs = Object
				.keys(state.blobs)
				.slice(-5)
				.reduce((obj : { [key: string]: Blob }, blobId : string) => {
					obj[blobId] = state.blobs[blobId];
					return obj;
				}, {});

			if (action.payload instanceof Blob) {
				newBlobs[action.payload.id] = action.payload;
			}

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
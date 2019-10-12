import api from "../../api";
import {IAction} from "../actions";
import Blob from "../../model/blob";

export enum FilesActions {
	LOAD_BLOB = 'FILES_LOAD_BLOB',
};

export const loadBlob = (
	repoId : string,
	hash : string = 'master',
	path : string = ''
) : IAction<FilesActions, () => Promise<Blob>> => ({
	type: FilesActions.LOAD_BLOB,
	payload: async () : Promise<Blob> => await api.commits.getBlob(repoId, hash, path)
});


import api from "../../api";

/**
 * @enum {string}
 */
export const FilesActions = {
	LOAD_BLOB: 'FILES_LOAD_BLOB',
};

/**
 *
 * @param {string} repoId
 * @param {string=} hash
 * @param {string} path
 * @returns {{payload: (function(): Blob), type: string}}
 */
export const loadBlob = (repoId, hash = 'master', path = '') => ({
	type: FilesActions.LOAD_BLOB,
	payload: async () => await api.commits.getBlob(repoId, hash, path)
});

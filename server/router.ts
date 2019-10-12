import {IActionsContainer} from "./modules/actions";

import CommitsConstructor from './routes/commits';
import FilesConstructor from './routes/files';
import BlobConstructor from './routes/blob';
import RepoConstructor from './routes/repository';
import ApiConstructor from './routes/api';


export default ({actions} : { actions: IActionsContainer }) => {
	const commitsRoute = CommitsConstructor({
		actions,
	});
	const filesRoute = FilesConstructor({
		actions,
	});
	const blobRoute = BlobConstructor({
		actions,
	});
	const repoRoute = RepoConstructor({
		actions,
		commitsRoute,
		filesRoute,
		blobRoute,
	});
	const apiRoute = ApiConstructor({
		actions,
		repoRoute,
	});

	return apiRoute;
};

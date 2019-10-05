import React from 'react'
import Page from './page';
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from 'react-router-dom';
import Editor from "../blocks/Editor/Editor";

const createBlobTabs = (matchUrl, repoId, hash = 'master', path = '') => {
	const blobUrl = `/repository/${repoId}/blob/${hash}/${path}`;
	const commitsUrl = `/repository/${repoId}/commits/${hash}/${path}`;
	return [
		{
			text: 'details',
			url: blobUrl,
			isActive: matchUrl.includes(blobUrl),
		},
		{
			text: 'history',
			url: commitsUrl,
			isActive: matchUrl.includes(commitsUrl),
		}
	];
};

const BlobPage = (props) => {
	const {id, hash, path = ''} = props.match.params;
	const {url} = props.match;
	const tabs = createBlobTabs(url, id, hash, path);

	//const dispatch = useDispatch();
	const files = useSelector(({repos}) => (repos.trees[id] && repos.trees[id][path]) || []);
	const isLoading = useSelector(({repos}) => repos.filesLoading);
	const error = useSelector(({repos}) => repos.loadingError);

	if (!path) {
		return <Redirect to={`/repository/${id}/tree/${hash}`}/>
	}

	if (error) {
		return <Redirect to={`/404/`}/>
	}

	if (!error && !isLoading && !files.length) {
		//dispatch(loadFiles(id, hash, path, url));
	}


	return (
		<Page {...props} tabs={tabs}>
			<Editor/>
		</Page>
	);
};

export default BlobPage;


import React from 'react'
import Page from './page';
import {useDispatch, useSelector} from "react-redux";
import {Redirect, RouteComponentProps} from 'react-router-dom';
import Editor, {ILine} from "../blocks/Editor/Editor";
import Blob from "../model/blob";
import {loadBlob} from "../redux/files/actions";
import {cnBlock} from "../blocks/Block/Block";
import {PageParams} from "./page";
import {IRootState} from "../redux/reducer";

const createBlobTabs = (
	matchUrl : string,
	repoId : string,
	hash : string = 'master',
	path : string = ''
) => {
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

const parseLines = (rows : string[] = []) : ILine[] => {
	return rows.map((row : string, i) => ({
		numbers: [i + 1],
		value: row
	}))
};

const BlobPage = (props : RouteComponentProps<PageParams>) => {
	const {id, hash, path = ''} = props.match.params;
	const {url} = props.match;
	const tabs = createBlobTabs(url, id, hash, path);
	const dispatch = useDispatch();
	const blobId = Blob.createId(id, hash, path);
	const blob = useSelector((state : IRootState) => state.files.blobs[blobId] || null);
	const isLoading = useSelector((state : IRootState) => state.files.loadingBlob);
	const error = useSelector((state : IRootState) => state.files.loadingBlobError);

	if (!path) {
		return <Redirect to={`/repository/${id}/tree/${hash}`}/>
	}

	if (error) {
		return <Redirect to={`/404/`}/>
	}

	if (!isLoading && !blob) {
		dispatch(loadBlob(id, hash, path,));
	}

	const lines : ILine[] = (blob && parseLines(blob.rows)) || [];

	return (
		<Page {...props} tabs={tabs}>
			{
				isLoading ?
					<div>Loading...</div> :
					<Editor
						className={cnBlock({
						'indent-t': 'xl',
						'd-indent-t': 'm'
						})}
						lines={lines}
					    filename={(blob && blob.filename) || void 0}
					/>
			}
		</Page>
	);
};

export default BlobPage;


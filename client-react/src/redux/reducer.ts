import { combineReducers } from 'redux';
import trees, {ITreesState} from './trees/reducer';
import repos, {IReposState} from './repos/reducer';
import files, {IBlobState} from './files/reducer';

export interface IRootState {
	repos: IReposState;
	files: IBlobState;
	trees: ITreesState;
}

export default combineReducers<IRootState>({ repos, files, trees });
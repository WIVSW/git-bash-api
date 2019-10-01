import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {load} from './redux/repos/actions'

function App() {
  const repos = useSelector((state) => state.repos.items);
  const dispatch = useDispatch();

  if (!repos.length) {
    dispatch(load());
  }

  return (
    <div className="App">
      {
        repos.length ?
            repos.map((repo) => <div key={repo.id}>{repo.id}</div>) :
            null
      }
    </div>
  );
}

export default App;

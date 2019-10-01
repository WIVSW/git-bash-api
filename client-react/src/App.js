import React from 'react';
import { useSelector } from 'react-redux'

function App() {
  const repos = useSelector((state) => state.repos);
  return (
    <div className="App">
      {
        repos ?
            repos.map((repo) => <div key={repo.id}>{repo.id}</div>) :
            null
      }
    </div>
  );
}

export default App;

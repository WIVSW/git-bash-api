import React from 'react';
import { useSelector, useDispatch } from 'react-redux'

import {load} from './redux/repos/actions'
import Header from './blocks/Header/Header';

function App() {
  const repos = useSelector((state) => state.repos.items);
  const dispatch = useDispatch();

  if (!repos.length) {
	dispatch(load());
  }

  return (
      <React.Fragment>
        <Header/>
      </React.Fragment>
  );
}

export default App;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {BrowserRouter, Switch, Redirect, Route, RouteComponentProps} from 'react-router-dom';

import {load, selectRepo} from './redux/repos/actions'
import Header from './blocks/Header/Header';
import Footer from './blocks/Footer/Footer';
import Layout from "./blocks/Layout/Layout";
import {IRootState} from "./redux/reducer";


type WrapperParams = { id: string };

const Wrapper = (props : RouteComponentProps<WrapperParams>) => {
    const items = useSelector((state : IRootState) => state.repos.items);
    const dispatch = useDispatch();
    const id = props.match.params.id || null;
    if (!(
        id && items.length &&
        items.some((item) => item.id === id)
    )) {
        return <Redirect to={'/404/'}/>
    }

    dispatch(selectRepo(id));

    return (
        <React.Fragment>
            <Header />
            <Layout {...props} />
            <Footer />
        </React.Fragment>
    );
};

const NotFound = () => <div>Not Found</div>;

function App() {
  const repos = useSelector((state : IRootState) => state.repos.items);
  const dispatch = useDispatch();

  if (!repos.length) {
	dispatch(load());
	return null;
  }

  return (
        <BrowserRouter>
            <Switch>
                <Route exact path={'/'}>
                    <Redirect to={`/repository/${repos[0].id}`}/>
                </Route>
                <Route path={'/repository/:id'} component={Wrapper} />
                <Route path={'/404/'} component={NotFound} />
                <Route>
                    <Redirect to={'/404/'}/>
                </Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;

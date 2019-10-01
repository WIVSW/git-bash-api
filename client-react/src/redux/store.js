import {applyMiddleware, createStore} from "redux";
import promise from "redux-promise-middleware";

import reducer from "./reducer";

export default applyMiddleware(promise)(createStore)(reducer)
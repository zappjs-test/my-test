import React from 'react';
import thunk from 'redux-thunk';

import { render } from 'react-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux';

const router = routerMiddleware(browserHistory);

const store = createStore(
	combineReducers({
		routing: routerReducer,
	}),
	applyMiddleware(
		thunk,
		router
	)
);

const history = syncHistoryWithStore(browserHistory, store);

render(
	<Provider store={store}>
		<Router history={history}>
		</Router>
	</Provider>,
	document.getElementById('app')
);

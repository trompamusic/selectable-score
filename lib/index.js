import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import { reducers } from 'meld-clients-core/lib/reducers';
import TestApp from './containers/testApp';
const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);
ReactDOM.render( /*#__PURE__*/React.createElement(Provider, {
  store: createStoreWithMiddleware(reducers)
}, /*#__PURE__*/React.createElement(TestApp, null)), document.querySelector('.container'));
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './stores/configureStore';
import configureSignalR from './configureSignalR';
import App from './App';

import 'bootstrap/dist/js/bootstrap.js';

const initialState = {};

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

const store = configureStore(history, initialState);

const rootElement = document.getElementById('root');

configureSignalR();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  rootElement);

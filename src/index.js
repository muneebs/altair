/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React from 'react';
import registerServiceWorker from './registerServiceWorker';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { configureStore } from 'altair-redux';
import localForage from 'localforage';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

const store = configureStore(
  localForage,
  config,
  {
    userProfile: 'users',
    useFirestoreForProfile: true
  },
  {
    appId: process.env.REACT_APP_ALGOLIA_APP_ID,
    searchKey: process.env.REACT_APP_ALGOLIA_SEARCH_KEY
  }
);

ReactDOM.render(
  <Router>
    <App store={store} />
  </Router>,
  document.getElementById('root')
);
registerServiceWorker();

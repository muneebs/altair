/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from './components/AsyncComponent';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

const AsyncHome = asyncComponent(() => import('./containers/Main'));
const AsyncLogin = asyncComponent(() => import('./containers/Login'));
const AsyncNotFound = asyncComponent(() => import('./containers/NotFound'));

export default ({ childProps }) => (
  <Switch>
    <AuthenticatedRoute
      path="/"
      exact
      component={AsyncHome}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={AsyncNotFound} />
  </Switch>
);

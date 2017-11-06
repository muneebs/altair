/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React from 'react';
import { Route } from 'react-router-dom';

export default ({ component: C, props: cProps, ...rest }) => (
  <Route {...rest} render={props => <C {...props} {...cProps} />} />
);

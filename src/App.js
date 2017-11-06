/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import Routes from './Routes';
import 'babel-polyfill';
import { AppActions, UserActions } from 'altair-redux';

const theme = createMuiTheme();

export default class App extends Component {
  state = {
    loading: true,
    isAuthenticated: false,
    isAuthenticating: true
  };

  componentWillMount() {
    this.initStore();
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };
  initStore = async () => {
    this.props.store.subscribe(this.onStoreStateChange);
    this.props.store.dispatch(UserActions.getSessionTokenRequest());
    this.props.store.dispatch(AppActions.appInitFinished());
    this.setState({ loading: false });
  };
  onStoreStateChange = () => {
    const user = this.props.store.getState().entities.user;
    this.setState({
      isAuthenticated: user.isAuthenticated,
      isAuthenticating: false
    });
  };
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      <Provider store={this.props.store}>
        <MuiThemeProvider theme={theme}>
          <div>
            {!this.state.isAuthenticating ? (
              <Routes childProps={childProps} />
            ) : (
              <div className="loader">Loading...</div>
            )}
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

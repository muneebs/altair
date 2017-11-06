/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React, { PureComponent } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import PropTypes from 'prop-types';
import logo from '../assets/logo.svg';

class SDAppBar extends PureComponent {
  state = {
    anchorEl: null,
    open: false
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <img alt="logo" src={logo} className={classes.logo} />
          <div className={classes.flex} />
          <Button
            className={classes.profileButton}
            aria-owns={this.state.open ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <AccountCircle />
            <span style={{ marginLeft: 5 }}>
              {this.props.user.name ? this.props.user.name : ''}
            </span>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
          >
            {/*<MenuItem onClick={this.handleRequestClose}>Profile</MenuItem>*/}
            {/*<MenuItem onClick={this.handleRequestClose}>My account</MenuItem>*/}
            <MenuItem onClick={this.props.handleSignOut}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

SDAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleSignOut: PropTypes.func.isRequired
};

export default SDAppBar;

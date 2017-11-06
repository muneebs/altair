import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import AppBar from '../../components/AppBar';
import CustomerTable from '../../components/CustomerTable';
import { CustomerActions, UserActions } from 'altair-redux';

/**
 * Map redux state to props
 *
 * @param {Object} state - the state
 * @returns {Object} -
 */
const mapStateToProps = state => {
  return {
    user: state.entities.user,
    customers: state.entities.customers.customers
  };
};

/**
 * Bind all the actions from UserActions to the dispatcher
 *
 * @param {Dispatch} dispatch - the dispatcher
 * @returns {Dispatch} actions
 */
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...CustomerActions, ...UserActions }, dispatch)
  };
};

const styles = theme => ({
  root: {
    width: '100%',
    height: 'calc(100% - 56px)',
    zIndex: 1,
    overflow: 'hidden'
  },
  appFrame: {
    width: '100%',
    display: 'flex',
    minHeight: '100%',
    alignItems: 'stretch'
  },
  appBar: {
    top: 0,
    left: 'auto',
    right: 0,
    position: 'fixed'
  },
  flex: {
    flex: 1
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64
    }
  }
});

class Main extends Component {
  componentWillMount() {
    this.props.actions.customersRequest();
  }

  handleSignOut = () => {
    this.props.actions.signOutRequest();
  };

  render() {
    const { classes } = this.props;
    const customers = Object.keys(this.props.customers).map(key => {
      return this.props.customers[key];
    });
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            title="Customers"
            classes={classes}
            user={this.props.user}
            handleSignOut={this.handleSignOut}
          />
          <main className={classes.content}>
            <CustomerTable customers={customers} />
          </main>
        </div>
      </div>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withStyles(styles)(Main)
);

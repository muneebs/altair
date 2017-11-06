/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import AppBar from '../../components/AppBar';
import CustomerTable from '../../components/CustomerTable';
import { CustomerActions, UserActions, SearchActions } from 'altair-redux';
import AddCustomerDialog from '../../components/AddCustomerDialog';
import * as animationData from '../../assets/bouncy_mapmaker.json';
import Lottie from 'react-lottie';

import {
  GoogleMap,
  OverlayView,
  withGoogleMap,
  withScriptjs
} from 'react-google-maps';

const mapStyle = require('../../assets/mapStyle');
const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2)
});

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const MyMapComponent = withScriptjs(
  withGoogleMap(props => {
    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: -33.9250245, lng: 18.4177873 }}
        defaultOptions={{
          styles: mapStyle,
          disableDefaultUI: true,
          noClear: true
        }}
      >
        {props.customers.map(customer => {
          if (typeof customer.address === 'string') {
            return null;
          }
          return (
            <OverlayView
              position={{
                lat: customer.address.location.latitude,
                lng: customer.address.location.longitude
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              getPixelPositionOffset={getPixelPositionOffset}
            >
              <div className="mapOverlayIcon">
                <Lottie
                  options={defaultOptions}
                  height={70}
                  width={70}
                  isStopped={false}
                  isPaused={false}
                />
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>
    );
  })
);

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
    actions: bindActionCreators(
      { ...CustomerActions, ...UserActions, ...SearchActions },
      dispatch
    )
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
    alignItems: 'center',
    flexDirection: 'column'
  },
  appBar: {
    backgroundColor: 'transparent',
    top: 0,
    left: 'auto',
    right: 0,
    position: 'static'
  },
  profileButton: {
    color: '#c6c6c6'
  },
  flex: {
    flex: 1
  },
  logo: {
    marginRight: 12
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    paddingLeft: 24,
    paddingRight: 24,
    height: 'calc(100% - 56px)',
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)'
    }
  },
  mapContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    width: '100%'
  }
});

class Main extends Component {
  state = {
    dialogOpen: false
  };

  componentWillMount() {
    this.props.actions.customersRequest();
  }

  handleSignOut = () => {
    this.props.actions.signOutRequest();
  };

  handleAddClick = () => {
    this.setState({ dialogOpen: true });
  };

  handleRequestSaveCustomer = customer => {
    this.props.actions.createCustomerRequest(customer);
    this.setState({ dialogOpen: false });
  };

  handleDeleteSelected = selected => {
    selected.forEach(select => {
      this.props.actions.deleteCustomerRequest(select);
    });
  };

  handleOnSearchChange = evt => {
    this.props.actions.searchCustomersRequest(evt.target.value);
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
          <div className={classes.mapContainer}>
            <MyMapComponent
              customers={customers}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process
                .env.REACT_APP_FIREBASE_API_KEY}`}
              loadingElement={<div style={{ height: '100%' }} />}
              containerElement={<div style={{ height: '350px' }} />}
              mapElement={<div style={{ height: '100%' }} />}
            />
          </div>
          <main className={classes.content}>
            <CustomerTable
              handleAddClick={this.handleAddClick}
              handleOnSearchChange={this.handleOnSearchChange}
              deleteSelected={this.handleDeleteSelected}
              customers={customers}
            />
            <AddCustomerDialog
              isOpen={this.state.dialogOpen}
              handleRequestSave={this.handleRequestSaveCustomer}
              close={() => {
                this.setState({ dialogOpen: false });
              }}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withStyles(styles)(Main)
);

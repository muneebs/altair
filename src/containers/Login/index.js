/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { UserActions } from 'altair-redux';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import styles from './styles';
import TextField from 'material-ui/TextField';
import Lottie from 'react-lottie';
import * as animationData from '../../assets/gradient_animated_background.json';
import './Login.css';

/**
 * Map redux state to props
 *
 * @param {Object} state - the state
 * @returns {Object} -
 */
const mapStateToProps = state => {
  return {
    user: state.entities.user,
    confirmationResult: state.requests.user.confirmationResult,
    login: state.requests.user.login
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
    actions: bindActionCreators({ ...UserActions }, dispatch)
  };
};

// animation options for the sexy gradient
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

/**
 * Login Component
 */
class Login extends Component {
  state = {
    user: null,
    message: '',
    code: '',
    phoneNumber: '+27',
    confirmResult: null,
    confirming: false,
    sendingCode: false
  };

  componentDidMount() {
    this.props.firebase.auth().useDeviceLanguage();
    this.recaptchaVerifier = new this.props.firebase.auth
      .RecaptchaVerifier('recaptcha-container', {
      size: 'normal',
      callback: response => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        this.setState({ confirmResult: response, confirming: false });
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
    this.animation.setSpeed(0.3);
  }

  componentWillReceiveProps(props) {
    if (props.confirmationResult.error || props.login.error) {
      this.setState({ confirmResult: null, confirming: false });
    }
    if (
      props.confirmationResult.status === 'SUCCESS' &&
      props.login.status === 'SUCCESS'
    ) {
      this.props.userHasAuthenticated(true);
    }
  }

  verify = () => {
    this.setState({ confirming: true });
    this.props.actions.confirmationRequest(this.state.code);
  };

  login = () => {
    this.setState({ confirming: true, recaptcha: true });
    this.props.actions.loginRequest(
      this.state.phoneNumber,
      this.recaptchaVerifier
    );
  };

  renderPhoneInput = () => {
    const { classes } = this.props;
    return (
      <Grid className={classes.paperContainer} item xs={12}>
        <Grid item xs={12}>
          <Typography type="headline" component="h3">
            Hello there!
          </Typography>
          <Typography type="body1" component="p">
            Enter your phone number to sign in to my awesome app.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form
            noValidate
            autoComplete="off"
            onSubmit={e => {
              e.preventDefault();
              this.login();
            }}
          >
            <Grid
              className={classes.loginForm}
              container
              alignItems={'center'}
              justify={'center'}
              direction={'column'}
            >
              <Grid item>
                <TextField
                  className={classes.textField}
                  id="phone"
                  label="Phone number"
                  disabled={this.state.confirming}
                  value={this.state.phoneNumber}
                  onChange={evt => {
                    this.setState({ phoneNumber: evt.target.value });
                  }}
                  type="tel"
                />
              </Grid>
              <Grid item>
                <div id="recaptcha-container" ref="recaptcha-container" />
                {this.state.confirming ? (
                  <CircularProgress
                    className={classes.progress}
                    style={{ color: purple[500] }}
                  />
                ) : (
                  <Button
                    className={classes.button}
                    color="primary"
                    raised
                    onClick={this.login}
                    title={'Verify'}
                  >
                    Verify
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  };

  renderVerificationInput = () => {
    const { classes } = this.props;
    return (
      <Grid className={classes.paperContainer} item xs={12}>
        <Grid item xs={12}>
          <Typography type="body1" component="p">
            We sent you an SMS, please enter the verification code below.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form
            noValidate
            autoComplete="off"
            onSubmit={e => {
              e.preventDefault();
              this.verify();
            }}
          >
            <Grid
              className={classes.loginForm}
              container
              alignItems={'center'}
              justify={'center'}
              direction={'column'}
            >
              <Grid item>
                <TextField
                  className={classes.textField}
                  id="verify"
                  label="Verification Code"
                  disabled={this.state.confirming}
                  value={this.state.code}
                  onChange={evt => {
                    this.setState({ code: evt.target.value });
                  }}
                  type="tel"
                />
              </Grid>
              <Grid item>
                {this.state.confirming ? (
                  <CircularProgress
                    className={classes.progress}
                    style={{ color: purple[500] }}
                  />
                ) : (
                  <Button
                    className={classes.button}
                    color="primary"
                    raised
                    onClick={this.verify}
                    title={'Verify'}
                  >
                    Verify
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  };

  renderMessage = () => {
    const { classes } = this.props;
    const message =
      this.props.login.error || this.props.confirmationResult.error;
    if (message) {
      return (
        <Grid item>
          <Paper className={classes.paper} elevation={4}>
            <div>
              <Typography type="body2" component="p" color="error">
                Ooops something does not look right here...
              </Typography>
              <Typography type="body1" component="p">
                {message}
              </Typography>
            </div>
          </Paper>
        </Grid>
      );
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    const { user, confirmResult } = this.state;
    return (
      <div>
        <div
          className={'gradientContainer'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Lottie
            ref={ref => {
              this.animation = ref;
            }}
            options={defaultOptions}
            speed={0.3}
            isStopped={false}
            isPaused={false}
          />
        </div>
        <Grid
          container
          className={classes.root}
          alignItems={'center'}
          direction={'column'}
          justify={'center'}
        >
          {this.renderMessage()}
          <Grid className={classes.paperContainer} item xs={12}>
            <Paper className={classes.paper} elevation={4}>
              {!user && !confirmResult && this.renderPhoneInput()}
              {!user && confirmResult && this.renderVerificationInput()}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps)
)(withStyles(styles)(Login));

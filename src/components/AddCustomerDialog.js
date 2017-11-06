/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';
import { isValidSAID } from '../utils/idNumberValidator';
import { isEmpty } from 'lodash';

const styles = theme => {
  return {
    appBar: {
      position: 'relative'
    },
    flex: {
      flex: 1
    },
    container: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: 24,
      height: 'calc(100% - 56px)',
      marginTop: theme.spacing.unit
    },
    formControl: {
      width: '100%',
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    textField: {
      width: '100%'
    }
  };
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AddCustomerDialog extends Component {
  state = {
    firstName: '',
    firstNameError: false,
    surname: '',
    surnameError: false,
    dateOfBirth: '',
    idNumber: '',
    idNumberError: false,
    address: '',
    addressError: false,
    message: null
  };

  handleChange = name => event => {
    if (name === 'idNumber' && event.target.value.length >= 13) {
      if (isValidSAID(event.target.value)) {
        this.setState({ idNumberError: false });
      } else {
        this.setState({ idNumberError: true });
      }
    }
    this.setState({
      [name]: event.target.value
    });
  };

  handleRequestClose = () => {
    this.props.close();
  };

  handleRequestSave = () => {
    if (isEmpty(this.state.firstName)) {
      this.setState({ firstNameError: true });
    }
    if (isEmpty(this.state.surname)) {
      this.setState({ surnameError: true });
    }
    if (this.state.idNumber.length < 13) {
      this.setState({ idNumberError: true });
    }
    if (isEmpty(this.state.address)) {
      this.setState({ addressError: true });
    }
    if (
      this.state.idNumberError ||
      this.state.addressError ||
      this.state.firstNameError ||
      this.state.surnameError
    ) {
      return this.setState({ message: 'Please fix the errors on the form.' });
    }
    return this.props.handleRequestSave({
      firstName: this.state.firstName,
      surname: this.state.surname,
      idNumber: this.state.idNumber,
      dateOfBirth: this.state.dateOfBirth,
      address: this.state.address
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          fullScreen
          open={this.props.isOpen}
          onRequestClose={this.handleRequestClose}
          transition={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="contrast"
                onClick={this.handleRequestClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <div className={classes.flex} />
              <Button color="contrast" onClick={this.handleRequestSave}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.container}>
            <Typography component="p" color="error">
              {this.state.message}
            </Typography>
            <form noValidate autoComplete="off">
              <TextField
                required
                id="firstName"
                error={this.state.firstNameError}
                helperText={
                  this.state.firstNameError ? 'This field is required.' : ''
                }
                label="First Name"
                className={classes.textField}
                value={this.state.firstName}
                onChange={this.handleChange('firstName')}
                margin="normal"
              />
              <TextField
                required
                id="surname"
                label="Surname"
                error={this.state.surnameError}
                helperText={
                  this.state.surnameError ? 'This field is required.' : ''
                }
                value={this.state.surname}
                onChange={this.handleChange('surname')}
                className={classes.textField}
                margin="normal"
              />
              <TextField
                required
                id="idNumber"
                label="ID Number"
                error={this.state.idNumberError}
                value={this.state.idNumber}
                helperText={
                  this.state.idNumberError
                    ? 'A valid South African ID Number is required.'
                    : ''
                }
                onChange={this.handleChange('idNumber')}
                className={classes.textField}
                margin="normal"
              />
              <TextField
                required
                id="date"
                label="Birthday"
                type="date"
                defaultValue="2017-05-24"
                className={classes.textField}
                onChange={this.handleChange('dateOfBirth')}
                margin="normal"
              />
              <TextField
                required
                id="address"
                label="Address"
                error={this.state.addressError}
                helperText={
                  this.state.addressError ? 'This field is required.' : ''
                }
                value={this.state.address}
                onChange={this.handleChange('address')}
                className={classes.textField}
                margin="normal"
              />
            </form>
          </div>
        </Dialog>
      </div>
    );
  }
}

AddCustomerDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  handleRequestSave: PropTypes.func.isRequired
};

export default withStyles(styles)(AddCustomerDialog);

/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

const styles = theme => {
  return {
    root: theme.mixins.gutters({
      paddingTop: 16,
      paddingBottom: 16,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2
    }),
    paper: theme.mixins.gutters({
      paddingTop: 16,
      paddingBottom: 16,
      marginTop: theme.spacing.unit * 3
    }),
    button: {
      marginTop: theme.spacing.unit * 3
    },
    paperContainer: {},
    loginForm: {
      marginTop: 16
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },
    progress: {
      margin: `0 ${theme.spacing.unit * 2}px`
    }
  };
};

export default styles;

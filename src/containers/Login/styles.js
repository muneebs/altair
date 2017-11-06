/*
 * @flow
 *
 * ScoobyDoo-it (https://www.scoobydoo-it.com/)
 *
 * Copyright © 2017 by ScoobyDoo-it (Pty) Ltd. All Rights Reserved.
 *
 * This file is subject to the terms and conditions defined in file 'LICENSE.txt',
 * which is part of this source code package.
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

/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import keycode from 'keycode';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import moment from 'moment';

const columnData = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'First Name'
  },
  { id: 'surname', numeric: true, disablePadding: false, label: 'Surname' },
  { id: 'dob', numeric: true, disablePadding: true, label: 'Date of birth' },
  { id: 'idNumber', numeric: true, disablePadding: false, label: 'ID Number' },
  { id: 'address', numeric: true, disablePadding: false, label: 'Address' }
];

class EnhancedTableHead extends Component {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: 2
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.A700,
          backgroundColor: theme.palette.secondary.A100
        }
      : {
          color: theme.palette.secondary.A100,
          backgroundColor: theme.palette.secondary.A700
        },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  },
  searchContainer: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '2px'
  },
  searchIconContainer: {
    width: '72px',
    height: '100%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    pointerEvents: 'none',
    justifyContent: 'center'
  },
  searchIcon: {
    fill: 'currentColor',
    width: '24px',
    height: '24px',
    display: 'inline-block',
    transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    userSelect: 'none',
    flexShrink: 0
  },
  addressAutoComplete: {
    position: 'relative',
    display: 'inline-block',
    direction: 'ltr'
  },
  searchInput: {
    font: 'inherit',
    color: 'inherit',
    border: '1px solid #ccc',
    margin: 0,
    padding: '8px 8px 8px 72px',
    display: 'block',
    background: 'none',
    whiteSpace: 'normal',
    userSelect: 'text',
    verticalAlign: 'middle'
  },
  searchProvider: {
    paddingRight: 12
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, selected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography type="subheading">{numSelected} selected</Typography>
        ) : (
          <Typography type="title">Customers</Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <a
        href="https://www.algolia.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className={classes.searchProvider}
          alt="Search by Algolia"
          height={40}
          src="https://www.algolia.com/static_assets/images/press/downloads/algolia-logo-light.svg"
        />
      </a>
      <div className={classes.searchContainer}>
        <div className={classes.searchIconContainer}>
          <svg
            className={classes.searchIcon}
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <span
          style={{
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <input
            className={classes.searchInput}
            onChange={props.handleOnSearchChange}
          />
        </span>
      </div>
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton
              aria-label="Delete"
              onClick={() => {
                props.deleteSelected(selected);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Create new customer">
            <IconButton
              aria-label="Create new customer"
              onClick={props.handleAddClick}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  handleAddClick: PropTypes.func.isRequired,
  deleteSelected: PropTypes.func.isRequired,
  handleOnSearchChange: PropTypes.func.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.props.customers.sort(
            (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
          )
        : this.props.customers.sort(
            (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
          );

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.customers.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, customers } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          handleAddClick={this.props.handleAddClick}
          numSelected={selected.length}
          deleteSelected={this.props.deleteSelected}
          handleOnSearchChange={this.props.handleOnSearchChange}
          selected={selected}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={customers.length}
            />
            <TableBody>
              {customers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      onKeyDown={event => this.handleKeyDown(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell padding="none">{n.firstName}</TableCell>
                      <TableCell numeric>{n.surname}</TableCell>
                      <TableCell padding="none">
                        {moment(n.dateOfBirth).format('MMMM Do YYYY')}
                      </TableCell>
                      <TableCell numeric>{n.idNumber}</TableCell>
                      <TableCell numeric>{n.address.address}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={customers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  handleAddClick: PropTypes.func.isRequired,
  deleteSelected: PropTypes.func.isRequired,
  handleOnSearchChange: PropTypes.func.isRequired
};

export default withStyles(styles)(EnhancedTable);

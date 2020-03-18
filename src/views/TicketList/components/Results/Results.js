import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Grid,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  CardActions,
  TablePagination
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Label } from 'components';
import { ReviewStars, GenericMoreButton, TableEditBar } from 'components';

import { getTickets } from 'services/ticketService';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'utils/axios';
import { Paginate } from 'components';
import { ProjectCard } from 'components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2)
  },
  title: {
    position: 'relative',
    '&:after': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      content: '" "',
      height: 3,
      width: 48,
      backgroundColor: theme.palette.primary.main
    }
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  sortButton: {
    textTransform: 'none',
    letterSpacing: 0,
    marginRight: theme.spacing(2)
  },
  paginate: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  }
}));

const Results = props => {
  const { className, filters, ...rest } = props;

  const classes = useStyles();
  const sortRef = useRef(null);
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most popular');
  const [mode, setMode] = useState('grid');
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchTickets(filters) {
      try {
        const { data: ticketList } = await getTickets(filters);
        setShowSpinner(false);
        if (mounted) {
          setTickets(ticketList);
        }
      } catch (ex) {
        setShowSpinner(false);
      }
    }

    setShowSpinner(true);
    fetchTickets(filters);

    return () => {
      mounted = false;
    };
  }, []);

  const handleSortOpen = () => {
    setOpenSort(true);
  };

  const handleSortClose = () => {
    setOpenSort(false);
  };

  const handleSortSelect = value => {
    setSelectedSort(value);
    setOpenSort(false);
  };

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      {showSpinner && <CircularProgress style={{ marginLeft: '50%' }} />}

      <div className={classes.header}>
        <Typography className={classes.title} variant="h5">
          Mostrando {tickets.length} tickets
        </Typography>
      </div>
      <Typography color="textSecondary" gutterBottom variant="body2">
        {tickets.length} Tickets
      </Typography>
      <Card>
        <CardHeader action={<GenericMoreButton />} title="Tickets " />
        <Divider />
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" indeterminate="" />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Título</TableCell>

                    <TableCell>Categoría</TableCell>
                    <TableCell>Tipo</TableCell>

                    <TableCell>Asignado a</TableCell>
                    <TableCell>Creado por</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map(ticket => (
                    <TableRow key={ticket.id} selected="false">
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" value="true" />
                      </TableCell>
                      <TableCell>
                        {' '}
                        <a href={'/tickets/edit/' + ticket.id + '/'}>
                          #{ticket.id}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={'/tickets/edit/' + ticket.id + '/'}>
                          {ticket.title}
                        </a>
                        <Typography variant="body2">
                          {moment(ticket.created).format('DD MMM YYYY | hh:mm')}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {ticket.category ? ticket.category.title : '-'}
                      </TableCell>

                      <TableCell>
                        {ticket.type ? ticket.type.name : '-'}
                      </TableCell>

                      <TableCell>
                        {ticket.assigned_user
                          ? ticket.assigned_user.username
                          : '-'}
                      </TableCell>
                      <TableCell>{ticket.created_user.username}</TableCell>
                      <TableCell>
                        <Label color="red" variant="outlined">
                          {ticket.status.name}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          {/*TODO paginación
            <TablePagination
            component="div"
            count={tickets.length}
            rowsPerPageOptions={[5, 10, 25]}
          /> */}
        </CardActions>
      </Card>
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;

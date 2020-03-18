import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Chip,
  Typography,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Snackbar
} from '@material-ui/core';
import { Label } from 'components';

import CircularProgress from '@material-ui/core/CircularProgress';

import { DatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Select from '@material-ui/core/Select';

import {
  getTicketCategories,
  getTicketStatus,
  getUserList,
  patchTicketAssign
} from 'services/ticketService';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { Alert } from 'components';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {},

  Select: {
    zIndex: 1000
  },

  alert: {
    marginBottom: theme.spacing(3)
  },
  formGroup: {
    marginBottom: theme.spacing(3)
  },
  fieldGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  fieldHint: {
    margin: theme.spacing(1, 0)
  },
  tags: {
    marginTop: theme.spacing(1),
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  },
  flexGrow: {
    flexGrow: 1
  },
  dateField: {
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const TituloCategoria = props => {
  const { className, aboutValues, setAboutValues, ticket, ...rest } = props;

  const classes = useStyles();

  const initialValues = {
    name: '',
    tag: '',
    tags: ['Full-Time', 'ReactJS'],
    startDate: moment(),
    endDate: moment().add(1, 'day')
  };

  const [values, setValues] = useState({ ...initialValues });
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(ticket.status.name);
  const [userList, setUserList] = useState('');
  const [assigned, setAssigned] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [showAssignSpinner, setShowAssignSpinner] = useState(false);

  const [ticketCategories, setTicketCategories] = useState([]);
  const [ticketTypesStatusList, setTicketStatusList] = useState([]);

  const [calendarTrigger, setCalendarTrigger] = useState(null);

  const onStatusChange = event => {
    event.persist();
    console.log('status change', event.target.value);
    setStatus(event.target.value);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const onCategoryChange = (event, values) => {
    setAboutValues(aboutValues => ({
      ...aboutValues,
      ['category']: values
    }));

    if (values) {
      setValue(values.title);
    } else {
      setValue('');
    }
  };

  const onAssignedChange = (event, values) => {
    const ticketAssign = { assigned_user: values ? values.id : null };

    async function doAssingTicket(ticketClose, values) {
      try {
        const { data: commentCreated } = await patchTicketAssign(
          ticket.id,
          ticketClose
        );
        ticket.assigned_user = values;

        setOpenSnackbar(true);
        setShowAssignSpinner(false);
      } catch (ex) {
        setOpenSnackbar(true);
        setShowAssignSpinner(false);

        console.log(ex);
      }
    }

    setShowAssignSpinner(true);
    doAssingTicket(ticketAssign, values);
  };

  const handleFieldChange = (event, field, value) => {
    event.persist && event.persist();
    setAboutValues(aboutValues => ({
      ...aboutValues,
      [field]: value
    }));
  };

  const handleCalendarOpen = trigger => {
    setCalendarTrigger(trigger);
  };

  const handleCalendarChange = () => {};

  const handleCalendarAccept = date => {
    setValues(values => ({
      ...values,
      [calendarTrigger]: date
    }));
  };

  const handleCalendarClose = () => {
    setCalendarTrigger(false);
  };

  const calendarOpen = Boolean(calendarTrigger);
  const calendarMinDate =
    calendarTrigger === 'startDate'
      ? moment()
      : moment(values.startDate).add(1, 'day');
  const calendarValue = values[calendarTrigger];

  useEffect(() => {
    let mounted = true;

    async function fetchTicketCategories() {
      const { data: ticketCategoryList } = await getTicketCategories();
      const { data: ticketStatusList } = await getTicketStatus();
      const { data: userList } = await getUserList(
        '?groups__name__in=tasker_sistemas'
      );
      if (mounted) {
        setTicketCategories(ticketCategoryList);
        setTicketStatusList(ticketStatusList);
        setUserList(userList);
        setStatus(ticket.status.name);
        setAssigned(
          ticket.assigned_user.first_name + ' ' + ticket.assigned_user.last_name
        );
      }
    }

    fetchTicketCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Fragment>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardHeader title={'Ticket #' + ticket.id} />
        <Divider />
        <CardContent className={classes.content}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Asignado a</TableCell>
                <TableCell>
                  {showAssignSpinner && (
                    <CircularProgress style={{ marginLeft: '50%' }} />
                  )}
                  {!showAssignSpinner && (
                    <Autocomplete
                      id="combo-box-demo"
                      options={userList}
                      getOptionLabel={option =>
                        option.first_name + ' ' + option.last_name
                      }
                      style={{ width: 300 }}
                      onChange={onAssignedChange}
                      value={
                        ticket.assigned_user
                          ? ticket.assigned_user.first_name +
                            ' ' +
                            ticket.assigned_user.last_name
                          : '(sin asignar)'
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={
                            ticket.assigned_user
                              ? ticket.assigned_user.first_name +
                                ' ' +
                                ticket.assigned_user.last_name
                              : '(sin asignar)'
                          }
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  )}
                </TableCell>
              </TableRow>

              <TableRow selected>
                <TableCell>Tipo </TableCell>
                <TableCell>
                  <Label color="red" variant="outlined">
                    {ticket.type.name}
                  </Label>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Creado</TableCell>
                <TableCell>
                  {moment(ticket.created).format('DD/MM/YYYY | hh:mm')}
                </TableCell>
              </TableRow>

              <TableRow selected>
                <TableCell>Estado</TableCell>
                <TableCell>
                  <Label color="primary" variant="outlined">
                    {ticket.status.name}
                  </Label>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reportado por: </TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>
                  {ticket.created_user.first_name +
                    ' ' +
                    ticket.created_user.last_name}
                </TableCell>
              </TableRow>
              <TableRow selected>
                <TableCell>Título</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>
                  {ticket.title}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Descripción</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>
                  {ticket.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>N° de equipo</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>
                  {ticket.device_number ? ticket.device_number : '-'}
                </TableCell>
              </TableRow>

              {ticket.files &&
                ticket.files.map(file => (
                  <TableRow key={file.id}>
                    <TableCell>Archivo Adjunto</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>
                      <a href={file.file}>{file.name}</a>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {ticket.comments.map(comment => (
        <Card {...rest} className={clsx(classes.root, className)}>
          <CardHeader
            title={
              comment.created_user.first_name +
              ' ' +
              comment.created_user.last_name +
              ' : ' +
              moment(comment.created).format('DD/MM/YYYY | hh:mm')
            }
          />{' '}
          <Divider />
          <CardContent>{comment.comment}</CardContent>
          {comment.files &&
            comment.files.map(file => (
              <CardContent className={classes.content} key={file.id}>
                <Divider />
                <Typography variant="subtitle2">Archivo Adjunto </Typography>

                <Typography variant="subtitle2">
                  {' '}
                  <a href={file.file}>{file.name}</a>
                </Typography>
              </CardContent>
            ))}
        </Card>
      ))}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        autoHideDuration={4000}
        message={
          <Typography color="inherit" variant="h6">
            Ticket asignado
          </Typography>
        }
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Fragment>
  );
};

TituloCategoria.propTypes = {
  className: PropTypes.string
};

export default TituloCategoria;

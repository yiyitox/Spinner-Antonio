import React, { useEffect, useState } from 'react';
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
  Typography
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Select from '@material-ui/core/Select';

import { getTicketCategories } from 'services/ticketService';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { Alert } from 'components';

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

const CreateTicket = props => {
  const {
    className,
    aboutValues,
    setAboutValues,
    description,
    setDescription,
    ...rest
  } = props;

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
  const [ticketCategories, setTicketCategories] = useState([]);

  const [calendarTrigger, setCalendarTrigger] = useState(null);

  const onDescriptionChange = (event, value) => {
    console.log(event);
    console.log(value);
    setDescription(event);
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
      if (mounted) {
        setTicketCategories(ticketCategoryList);
      }
    }

    fetchTicketCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'jvanilla', label: 'jVanilla' }
  ];

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Describa el incidente o solicitud" />
      <CardContent>
        <form>
          <div className={classes.formGroup}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              onChange={event =>
                handleFieldChange(event, 'name', event.target.value)
              }
              value={aboutValues.name}
              variant="outlined"
            />
          </div>
          <div className={classes.formGroup}>
            <Typography className={classes.fieldHint} variant="body2">
              Elija la categoría
            </Typography>

            <div className={classes.fieldGroup}>
              <Autocomplete
                id="combo-box-demo"
                options={ticketCategories}
                getOptionLabel={option => option.title}
                style={{ width: 300 }}
                onChange={onCategoryChange}
                value={aboutValues['category']}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={value}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
        </form>

        <TextField
          id="outlined-multiline-static"
          multiline
          fullWidth
          rows="6"
          placeholder="Ingrese la descripción del pedido o incidente"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={event => onDescriptionChange(event.target.value)}
        />
        <TextField
          fullWidth
          label="N° de equipo (opcional)"
          name="device_number"
          onChange={event =>
            handleFieldChange(event, 'device_number', event.target.value)
          }
          value={aboutValues.device_number}
          variant="outlined"
        />
      </CardContent>
    </Card>
  );
};

CreateTicket.propTypes = {
  className: PropTypes.string
};

export default CreateTicket;

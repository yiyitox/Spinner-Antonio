import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getTicketTypes } from 'services/ticketService';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Radio,
  FormControlLabel,
  colors
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  option: {
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    maxWidth: 560,
    '& + &': {
      marginTop: theme.spacing(2)
    }
  },
  selectedOption: {
    backgroundColor: colors.grey[50]
  },
  optionRadio: {
    margin: -10
  },
  optionDetails: {
    marginLeft: theme.spacing(2)
  }
}));

const EditTicketHead = props => {
  const {
    match,
    className,
    value,
    typeSelected,
    setTypeSelected,
    ticket,
    ticketTypesList,
    ...rest
  } = props;

  const classes = useStyles();

  const [selected, setSelected] = useState('');

  const handleChange = (event, ticketType) => {
    setSelected(ticketType.name);
    //setTypeSelected(ticketType.name);
  };

  useEffect(() => {
    let mounted = true;

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Tipo de Ticket de soporte" />
      <CardContent>
        {ticketTypesList.map(ticketType => (
          <div
            className={clsx(classes.option, {
              [classes.selectedOption]: selected === ticketType.value
            })}
            key={ticketType.id}>
            <FormControlLabel
              label={
                <div className={classes.optionDetails}>
                  <Typography gutterBottom variant="h5">
                    {ticketType.name}
                  </Typography>

                  <Typography variant="body1">
                    {ticketType.description}
                  </Typography>
                </div>
              }
              control={
                <Radio
                  checked={ticketType.name === ticket.type.name}
                  className={classes.optionRadio}
                  color="primary"
                  onClick={event => handleChange(event, ticket.type.name)}
                />
              }></FormControlLabel>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

EditTicketHead.propTypes = {
  className: PropTypes.string
};

export default EditTicketHead;

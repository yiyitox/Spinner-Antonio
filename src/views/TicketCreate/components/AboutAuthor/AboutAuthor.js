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
    border: `2px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    maxWidth: 260,
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

const AboutAuthor = props => {
  const { className, value, typeSelected, setTypeSelected, ...rest } = props;

  const classes = useStyles();
  const [ticketTypes, setTicketTypes] = useState([]);

  const [selected, setSelected] = useState();

  const handleChange = (event, ticketType) => {
    setSelected(ticketType.name);
    setTypeSelected(ticketType.id);
  };

  useEffect(() => {
    let mounted = true;
    async function fetchTicketTypes() {
      const { data: ticketTypeList } = await getTicketTypes();
      if (mounted) {
        setTicketTypes(ticketTypeList);
      }
    }

    fetchTicketTypes();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Qué tipo de Ticket de soporte desea crear?" />
      <CardContent>
        {ticketTypes.map(ticketType => (
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
                </div>
              }
              control={
                <Radio
                  checked={selected === ticketType.name}
                  className={classes.optionRadio}
                  color="primary"
                  onClick={event => handleChange(event, ticketType)}
                />
              }></FormControlLabel>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

AboutAuthor.propTypes = {
  className: PropTypes.string
};

export default AboutAuthor;

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  options: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Preferences = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Preferencias" />
      <CardContent>
        <Typography variant="body2">
          Si lo desea, puede recibir novedades del ticket en su dirección de
          email
        </Typography>
        <div className={classes.options}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                defaultChecked //
              />
            }
            label="Recibir emails cuando el ticket tenga novedades"
          />
        </div>
      </CardContent>
    </Card>
  );
};

Preferences.propTypes = {
  className: PropTypes.string
};

export default Preferences;

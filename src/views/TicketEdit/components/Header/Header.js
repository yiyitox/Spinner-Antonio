import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography component="h2" gutterBottom variant="overline">
        Seguimiento de Ticket
      </Typography>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;

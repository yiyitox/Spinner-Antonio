/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField, Snackbar, Typography } from '@material-ui/core';
import auth from 'services/authService';
import CircularProgress from '@material-ui/core/CircularProgress';

import useRouter from 'utils/useRouter';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' }
    //email: true
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' }
  }
};

const useStyles = makeStyles(theme => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

const LoginForm = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const router = useRouter();

  const dispatch = useDispatch();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const doSubmit = async () => {
    try {
      const user = await auth.login(
        formState.values.email,
        formState.values.password
      );

      window.location = '/' ? '/' : '/change_password';
      setShowSpinner(false);
    } catch (ex) {
      setOpenSnackbar(true);
      setShowSpinner(false);
      console.log(ex);
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        auth.logout();
        this.setState({ errors });
      }
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    // dispatch(login());
    //console.log('handle submit');
    //console.log(formState);
    setShowSpinner(true);
    doSubmit();

    //router.history.push('/');
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <div className={classes.submitButton}>
        {showSpinner && <CircularProgress style={{ marginLeft: '50%' }} />}
      </div>

      {!showSpinner && (
        <form
          {...rest}
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}>
          <div className={classes.fields}>
            <TextField
              error={hasError('email')}
              fullWidth
              helperText={hasError('email') ? formState.errors.email[0] : null}
              label="Nombre de usuario"
              name="email"
              onChange={handleChange}
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Contraseña"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
          </div>
          <Button
            className={classes.submitButton}
            color="secondary"
            disabled={!formState.isValid}
            size="large"
            type="submit"
            variant="contained">
            Iniciar sesión{' '}
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            autoHideDuration={6000}
            message={
              <Typography color="inherit" variant="h6">
                Usuario o contraseña incorrecto
              </Typography>
            }
            onClose={handleSnackbarClose}
            open={openSnackbar}
          />
        </form>
      )}
    </div>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string
};

export default LoginForm;

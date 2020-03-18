import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Divider,
  Snackbar,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import useRouter from 'utils/useRouter';
import { FilesDropzone } from 'components';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';

import CircularProgress from '@material-ui/core/CircularProgress';

import { saveComment, patchTicket } from 'services/ticketService';

const useStyles = makeStyles(theme => ({
  root: {},
  personAddIcon: {
    marginRight: theme.spacing(1)
  },
  actions: {
    marginRight: 'right',
    display: 'flex',

    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1)
    },
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const horas = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24
];

const minutos = [0, 15, 30, 45];

const CommentBox = props => {
  const { className, ticket, ...rest } = props;

  const [comment, setCommment] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [files, setFiles] = useState('');

  const [minutes, setMinutes] = useState(ticket.resolution_time.split(':')[0]);
  const [hours, setHours] = useState(ticket.resolution_time.split(':')[1]);

  // el 2 acá queda muy feo
  const [openSnackbar2, setOpenSnackbar2] = useState(false);

  const classes = useStyles();

  const { history } = useRouter();

  useEffect(() => {
    setMinutes(ticket.resolution_time.split(':')[1]);
    setHours(ticket.resolution_time.split(':')[0]);
  }, [ticket.resolution_time]);

  const onCommentChange = (event, value) => {
    setCommment(event);
  };

  const onMinutesChange = (event, value) => {
    if (value) {
      setMinutes(value);
    } else {
      setMinutes(0);
    }
  };

  const onHoursChange = (event, value) => {
    if (value) {
      setHours(value);
    } else {
      setHours(0);
    }
  };

  const [showSpinner, setShowSpinner] = useState(false);

  const onCommentSubmit = event => {
    let commmentCreate = new FormData();

    setShowSpinner(true);


    for (let i = 0; i < files.length; i++) {
      commmentCreate.append('file', files[i]);
    }

    commmentCreate.append('ticket', ticket.id);
    commmentCreate.append('comment', comment);

    async function doSaveComment(commmentCreate) {
      try {
        const { data: commentCreated } = await saveComment(commmentCreate);
        setOpenSnackbar(true);
        setShowSpinner(false)

      } catch (ex) {
        setOpenSnackbar2(true);
        setShowSpinner(false)

        console.log(ex);
      }
    }

    doSaveComment(commmentCreate);
  };

  // close submit with comment
  const onCloseSubmit = event => {
    // status 3 = cerrado, por ahora lo hard codeamos, después habría que hacer algo mejor

    let ticketClose = new FormData();

    setShowSpinner(true);

    for (let i = 0; i < files.length; i++) {
      ticketClose.append('file', files[i]);
    }

    ticketClose.append('status', 3);
    ticketClose.append('comment', comment);

    const resolution_time = hours + ':' + minutes + ':00';
    ticketClose.append('resolution_time', resolution_time);

    async function doCloseTicket(ticketClose) {
      try {
        const { data: ticketCloseResult } = await patchTicket(
          ticket.id,
          ticketClose
        );
        setOpenSnackbar(true);
        setShowSpinner(false)

      } catch (ex) {
        setOpenSnackbar2(true);
        setShowSpinner(false)

        console.log(ex);
      }
    }

    doCloseTicket(ticketClose);
    console.log('submit');
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    history.push('/');
  };

  const handleSnackbarClose2 = () => {
    setOpenSnackbar2(false);
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        autoHideDuration={2000}
        message={
          <Typography color="inherit" variant="h6">
            Comentario enviado
          </Typography>
        }
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        autoHideDuration={4000}
        message={
          <Typography color="inherit" variant="h6">
            Ocurrió un problema al enviar el comentario, intente nuevamente.
          </Typography>
        }
        onClose={handleSnackbarClose2}
        open={openSnackbar2}
      />

      <CardHeader title="Responder" />
      <CardContent>
        <TextField
          id="outlined-multiline-static"
          multiline
          fullWidth
          rows="6"
          placeholder="Respuesta"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={event => onCommentChange(event.target.value)}
        />
      </CardContent>
      <CardContent>
        <FilesDropzone files={files} setFiles={setFiles} />
      </CardContent>
      <Divider />
      <CardContent></CardContent>

      <CardContent>
        <div className={classes.actions}>
          <Grid container spacing={6} style={{marginLeft:'13px'}}>
            <Grid item xs={6}>
              <Button
                justify="space-between"
                onClick={onCommentSubmit}
                color="primary"
                variant="contained">
                <ChatIcon className={classes.personAddIcon} />
                Enviar respuesta
              </Button>

            </Grid>
            <Grid item xs={6}>
              <Button
                color="secondary"
                onClick={onCloseSubmit}
                variant="contained">
                <CloseIcon className={classes.personAddIcon} />
                Responder y cerrar ticket
              </Button>

              <Typography color="inherit" variant="h6" style={{textTransform:'uppercase', marginTop:'15px', color:'#0D47A1', marginLeft:'55px '}}>
                Tiempo de resolución
              </Typography>

            </Grid>
          </Grid>
        </div>
        
        {showSpinner && <CircularProgress style={{marginLeft: '35%'}}/>}

        <div>
          <Grid container spacing={3} style={{marginLeft:'2%', marginTop:'15px'}}>
            <Grid item xs={6}></Grid>

            <Grid item xs={1.2}>
              <Autocomplete
                display="flex"
                id="combo-box-demo"
                options={horas}
                getOptionLabel={option => option}
                value={hours}
                onChange={onHoursChange}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={hours + 'h'}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <Autocomplete
                id="combo-box-demo"
                options={minutos}
                value={minutes}
                display="flex"
                getOptionLabel={option => option}
                onChange={onMinutesChange}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={minutes + 'm'}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
};

CommentBox.propTypes = {
  className: PropTypes.string
};

export default CommentBox;

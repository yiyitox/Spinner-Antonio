import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, Card, Snackbar, Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import useRouter from 'utils/useRouter';
import CircularProgress from '@material-ui/core/CircularProgress';


import { saveTicket } from 'services/ticketService';

import { Page } from 'components';
import {
  Header,
  AboutAuthor,
  CreateTicket,
  Preferences,
  UploadFiles,
  ProjectDetails
} from './components';
import { Editor, EditorState, convertToRaw } from 'draft-js';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3, 3, 6, 3)
  },
  aboutAuthor: {
    marginTop: theme.spacing(3)
  },
  aboutProject: {
    marginTop: theme.spacing(3)
  },
  projectCover: {
    marginTop: theme.spacing(3)
  },
  projectDetails: {
    marginTop: theme.spacing(3)
  },
  preferences: {
    marginTop: theme.spacing(3)
  },
  actions: {
    marginTop: theme.spacing(3)
  }
}));

const TicketCreate = () => {
  const classes = useStyles();
  const [typeSelected, setTypeSelected] = useState('');
  const [aboutValues, setAboutValues] = useState({});
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState('');
  const [editorState, setEditorState] = useState('');
  const { history } = useRouter();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    if (mensaje == 'Ticket creado') {
      history.push('/');
    }
  };

  const [showSpinner, setShowSpinner] = useState(false);

  const handleSubmit = event => {
    const category = aboutValues.category ? aboutValues.category.id : null;

      setShowSpinner(true);

    let form1 = new FormData();

    for (let i = 0; i < files.length; i++) {
      form1.append('file', files[i]);
    }

    form1.append('title', aboutValues.name);
    form1.append('description', description);
    form1.append('device_number', aboutValues.device_number);
    form1.append('place', 'asdfasdfasd222');
    form1.append('status', 1);
    form1.append('type', typeSelected);
    form1.append('category', category);

    async function doSaveTicket(ticket) {
      try {
        const { data: ticketCreado } = await saveTicket(ticket);
        setMensaje('Ticket creado');
        setOpenSnackbar(true);
        setShowSpinner(false)
      } catch (ex) {
        setMensaje('Error al crear ticket');
        setOpenSnackbar(true);
        setShowSpinner(false)

        console.log(ex);
      }
    }

    doSaveTicket(form1);
  };

  return (
    <Page className={classes.root} title="Crear Ticket">
      <Header />
      <AboutAuthor
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
        className={classes.aboutAuthor}
      />
      <CreateTicket
        aboutValues={aboutValues}
        setAboutValues={setAboutValues}
        className={classes.aboutProject}
        description={description}
        setDescription={setDescription}
      />
      <UploadFiles
        files={files}
        setFiles={setFiles}
        className={classes.projectCover}
      />

      <div className={classes.actions}>
        <Button
          onClick={handleSubmit}
          align="right"
          color="primary"
          variant="contained">
          Crear Ticket
        </Button>
        {showSpinner && <CircularProgress style={{marginLeft: '35%'}}/>}
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        autoHideDuration={4000}
        message={
          <Typography color="inherit" variant="h6">
            {mensaje}
          </Typography>
        }
        onClose={handleSnackbarClose}
        open={openSnackbar}
      />
    </Page>
  );
};

export default TicketCreate;

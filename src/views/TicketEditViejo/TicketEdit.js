import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import useRouter from 'utils/useRouter';

import { saveTicket, getTicket, getTicketTypes } from 'services/ticketService';

import { Page } from 'components';
import {
  Header,
  EditTicketHead,
  TituloCategoria,
  Preferences,
  ProjectCover,
  Descripcion
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

const TicketEdit = props => {
  const classes = useStyles();
  const [typeSelected, setTypeSelected] = useState('');
  const [ticket, setTicket] = useState({ type: { name: '' } });
  const [ticketTypesList, setTicketTypesList] = useState([]);

  const [aboutValues, setAboutValues] = useState({});
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState('');

  const { history } = useRouter();
  const { match, ...rest } = props;

  const { id } = match.params;

  //console.log('iddd es');
  //console.log(id);

  useEffect(() => {
    let mounted = true;
    async function fetchTicket() {
      const { data: ticket } = await getTicket(id);
      const { data: ticketTypesList } = await getTicketTypes();
      if (mounted) {
        setTicket(ticket);
        setTicketTypesList(ticketTypesList);
        setTypeSelected(ticket.type.name);
        console.log('ticket en edit head es es');
        console.log(ticket);
        console.log('ticket types list');
        console.log(ticketTypesList);
        console.log('selected es', typeSelected);
      }
    }

    fetchTicket();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = event => {
    console.log(aboutValues);
    const ticket = {
      title: aboutValues.name,
      description: description,
      place: 'asdfasdfasd',
      status: 1,
      type: 1,
      assigned_user: null,
      category: aboutValues['category'].id,
      files: []
    };

    async function doSaveTicket(ticket) {
      const { data: ticketCreado } = await saveTicket(ticket);
    }

    doSaveTicket(ticket);
    history.push('/tickets/');
    console.log('submit');
    //console.log(typeSelected);
    //console.log(aboutValues);
    //console.log(description);
  };

  return (
    <Page className={classes.root} title="Seguimiento de Ticket">
      <Header />
      <EditTicketHead
        typeSelected={typeSelected}
        ticketTypesList={ticketTypesList}
        setTypeSelected={setTypeSelected}
        className={classes.aboutAuthor}
        ticket={ticket}
      />
      <TituloCategoria
        aboutValues={aboutValues}
        setAboutValues={setAboutValues}
        setAboutValues={setAboutValues}
        className={classes.aboutProject}
        ticket={ticket}
      />
      <Descripcion
        description={description}
        setDescription={setDescription}
        className={classes.projectDetails}
      />
      <ProjectCover className={classes.projectCover} />
      <Preferences className={classes.preferences} />
      <div className={classes.actions}>
        <Button
          onClick={handleSubmit}
          align="right"
          color="primary"
          variant="contained">
          Guardar Cambios
        </Button>
      </div>
    </Page>
  );
};

export default TicketEdit;

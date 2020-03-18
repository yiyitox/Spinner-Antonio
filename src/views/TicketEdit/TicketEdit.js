import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import useRouter from 'utils/useRouter';
import CircularProgress from '@material-ui/core/CircularProgress';

import { saveTicket, getTicket, getTicketTypes } from 'services/ticketService';

import { Page } from 'components';
import {
  Header,
  EditTicketHead,
  TituloCategoria,
  Preferences,
  ProjectCover,
  Descripcion,
  CommentBox
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
  const [ticket, setTicket] = useState({
    type: { name: '' },
    category: { title: '' },
    status: { name: '' },
    created_user: { username: '' },
    assigned_user: { username: '', first_name: '', last_name: '' },
    comments: [],
    device_number: '',
    resolution_time: '11:11:11'
  });
  const [ticketTypesList, setTicketTypesList] = useState([]);

  const [ticketTypesStatusList, setTicketStatusList] = useState([]);
  const [aboutValues, setAboutValues] = useState({});
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState('');

  const { history } = useRouter();
  const { match, ...rest } = props;

  const { id } = match.params;

  //console.log('iddd es');
  //console.log(id);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchTicket() {
      const { data: ticket } = await getTicket(id);
      const { data: ticketTypesList } = await getTicketTypes();
      if (mounted) {
        setTicket(ticket);
        setTicketTypesList(ticketTypesList);
        setTypeSelected(ticket.type.name);
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
  };

  return (
    <Page className={classes.root} title="Seguimiento de Ticket">
      <Header />
      <TituloCategoria
        aboutValues={aboutValues}
        setAboutValues={setAboutValues}
        setAboutValues={setAboutValues}
        className={classes.aboutProject}
        ticket={ticket}
      />
      <CommentBox className={classes.aboutProject} ticket={ticket} />
    </Page>
  );
};

export default TicketEdit;

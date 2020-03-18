import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Tabs, Tab, Divider, colors } from '@material-ui/core';

import Results from '../TicketList/components/Results';
import auth from 'services/authService';

import { Page } from 'components';
import { Header, Summary, MisTickets, Invoices, Logs } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  tabs: {
    marginTop: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

const TicketListMain = props => {
  const { match, history } = props;
  const classes = useStyles();
  const { id, tab } = match.params;

  const currentUser = auth.getCurrentUser().id;

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  const tabs = [
    { value: 'asignados', label: 'Asignados a mí' },
    { value: 'creados', label: 'Creados por mí' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'cerrados', label: 'Cerrados' }
  ];

  const isAdmin = auth.getIsAdmin();

  if (isAdmin) {
    tabs.push({ value: 'sin_asignar', label: 'Sin Asignar' });
  }

  if (!tab) {
    return <Redirect to={`/ticketlist/creados`} />;
  }

  //if (!tabs.find(t => t.value === tab)) {
  //  return <Redirect to="/errors/error-404" />;
  //}
  //     filterset_fields = ('status', 'type', 'created_user',
  //     'created_user__username', 'assigned_user__username')
  return (
    <Page className={classes.root} title="Sistema de Tickets">
      <Header />
      <Tabs
        className={classes.tabs}
        onChange={handleTabsChange}
        scrollButtons="auto"
        value={tab}
        variant="scrollable">
        {tabs.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Divider className={classes.divider} />

      <div className={classes.content}>
        {tab === 'asignados' && (
          <Results filters={'?status=2&assigned_user=' + currentUser} />
        )}
        {tab === 'creados' && (
          <Results filters={'?created_user=' + currentUser + '&status!=3'} />
        )}
        {tab === 'sin_asignar' && (
          <Results
            filters={
              '?status=1' + (!isAdmin ? '&created_user=' + currentUser : '')
            }
          />
        )}
        {tab === 'en_proceso' && (
          <Results
            filters={
              '?status=2' + (!isAdmin ? '&created_user=' + currentUser : '')
            }
          />
        )}
        {tab === 'cerrados' && (
          <Results
            filters={
              '?status=3' + (!isAdmin ? '&created_user=' + currentUser : '')
            }
          />
        )}
      </div>
    </Page>
  );
};

TicketListMain.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default TicketListMain;

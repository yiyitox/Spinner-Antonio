/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import Computer from '@material-ui/icons/Computer';
import FindInPage from '@material-ui/icons/FindInPage';
import auth from 'services/authService';

import { Label } from 'components';

export default [
  {
    title: 'Menú',
    pages: [
      {
        title: 'Tickets',
        href: '/ticketlist/asignados',
        icon: HomeIcon
      },

      {
        title: 'Documentación del área',
        href: '/docs',
        icon: FindInPage,
        admin: true
      },
      {
        title: 'Activos',
        href: '/assets',
        icon: Computer,
        admin: true
      },
      {
        title: 'Proveedores',
        href: '/providers',
        icon: PeopleIcon,
        admin: true
      }
    ]
  }
];

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Input,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography
} from '@material-ui/core';

import { RichEditor } from 'components';
import { Editor, EditorState } from 'draft-js';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Page } from '../index';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Descripcion = props => {
  const { className, description, setDescription, ...rest } = props;
  const [data, setData] = useState('');

  const classes = useStyles();

  const onDescriptionChange = (event, value) => {
    console.log(event);
    console.log(value);
    setDescription(event);
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Descripción" />
      <CardContent>
        <Typography className={classes.notice} variant="body2">
          Remove this this customer’s data if he requested that, if not please
          be aware that what has been deleted can never brough back
        </Typography>
      </CardContent>
    </Card>
  );
};

Descripcion.propTypes = {
  className: PropTypes.string
};

export default Descripcion;

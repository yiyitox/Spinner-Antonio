import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Input,
  Card,
  CardHeader,
  CardContent,
  TextField
} from '@material-ui/core';

import { RichEditor } from 'components';
import { Editor, EditorState } from 'draft-js';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Page } from '../index';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProjectDetails = props => {
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
        <TextField
          id="outlined-multiline-static"
          multiline
          fullWidth
          rows="6"
          placeholder="Ingrese la descripción del pedido o incidente"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={event => onDescriptionChange(event.target.value)}
        />
      </CardContent>
    </Card>
  );
};

ProjectDetails.propTypes = {
  className: PropTypes.string
};

export default ProjectDetails;

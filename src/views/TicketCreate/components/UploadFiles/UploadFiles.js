import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, CardHeader, CardContent } from '@material-ui/core';

import { FilesDropzone } from 'components';

const useStyles = makeStyles(() => ({
  root: {}
}));

const UploadFiles = props => {
  const { className, files, setFiles, ...rest } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Adjuntar archivos" />
      <CardContent>
        <FilesDropzone files={files} setFiles={setFiles} />
      </CardContent>
    </Card>
  );
};

UploadFiles.propTypes = {
  className: PropTypes.string
};

export default UploadFiles;

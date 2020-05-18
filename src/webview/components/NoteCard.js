import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { EditorState, Editor } from 'draft-js';

const useStyles = makeStyles(theme => ({
  root: {
    breakInside: 'avoid',
    marginBottom: theme.spacing(2),
  },
  noteCard: {
    minHeight: '10em',
    fontSize: 'large',
    fontFamily: 'serif',
    backgroundColor: theme.palette.secondary[200],
  },
}));

const NoteCard = ({ content }) => {
  const classes = useStyles();

  const editorState = React.useMemo(
    () => EditorState.createWithContent(content),
    [content]
  );

  return (
    <div className={classes.root}>
      <Card className={classes.noteCard}>
        <CardContent>
          <Editor readOnly editorState={editorState} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteCard;

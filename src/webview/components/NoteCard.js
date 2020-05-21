import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { EditorState, Editor } from 'draft-js';

const useStyles = makeStyles(theme => ({
  root: {
    breakInside: 'avoid',
    marginBottom: theme.spacing(2),
  },
  noteHeader: {
    padding: theme.spacing(1, 1, 0, 2),
    position: 'relative',
  },
  moreButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  noteBody: {
    minHeight: '10em',
    fontSize: 'large',
    fontFamily: 'serif',
    backgroundColor: theme.palette.secondary[200],
  },
}));

const NoteCard = ({ note, handleEdit, handleDelete }) => {
  const classes = useStyles();

  const editorState = React.useMemo(
    () => EditorState.createWithContent(note.content),
    [note]
  );

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleMoreButtonClick = e => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const closeMenu = e => {
    setMenuAnchorEl(null);
    if (e) {
      e.stopPropagation();
    }
  };

  const handleDeleteClick = e => {
    e.stopPropagation();
    handleDelete();
    closeMenu();
  };

  return (
    <div className={classes.root}>
      <Card className={classes.noteBody} onClick={handleEdit}>
        <div className={classes.noteHeader}>
          <Typography variant="h6" noWrap>
            {note.title}
          </Typography>

          <IconButton
            className={classes.moreButton}
            size="small"
            aria-controls="card-operations"
            aria-haspopup="true"
            onClick={handleMoreButtonClick}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchorEl}
            keepMounted
            open={!!menuAnchorEl}
            onClose={closeMenu}
          >
            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
          </Menu>
        </div>

        <CardContent>
          <Editor readOnly editorState={editorState} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteCard;

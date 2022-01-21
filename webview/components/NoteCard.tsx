import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import { EditorState, Editor } from 'draft-js';

const NoteCard = ({ note, handleEdit, handleDelete }) => {
  const theme = useTheme();

  const editorState = React.useMemo(
    () => EditorState.createWithContent(note.content),
    [note]
  );

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleMoreButtonClick = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const closeMenu = (e) => {
    setMenuAnchorEl(null);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    handleDelete();
    closeMenu(e);
  };

  return (
    <Box sx={{ breakInside: 'avoid', marginBottom: theme.spacing(2) }}>
      <Card
        sx={{
          minHeight: '10em',
          fontSize: 'large',
          fontFamily: 'serif',
          backgroundColor: theme.palette.secondary[200],
        }}
        onClick={handleEdit}
      >
        <Box
          sx={{
            padding: theme.spacing(1, 1, 0, 2),
            position: 'relative',
          }}
        >
          <Typography variant="h6" noWrap>
            {note.title}
          </Typography>

          <IconButton
            sx={{
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
            }}
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
        </Box>

        <CardContent>
          <Editor readOnly editorState={editorState} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default NoteCard;

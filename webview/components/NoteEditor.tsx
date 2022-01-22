import React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import DoneIcon from '@mui/icons-material/Done';
import TitleIcon from '@mui/icons-material/Title';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import CodeSharpIcon from '@mui/icons-material/CodeSharp';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { Editor, RichUtils, EditorState } from 'draft-js';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const IS_ON_IOS_SAFARI =
  typeof window === 'object' &&
  /iPad|iPhone|iPod/.test(window.navigator.platform);

const EMPTY_EDITOR_STATE = EditorState.createEmpty();

const SUPPORTED_INLINE_STYLE = [
  { name: 'bold', key: 'BOLD', iconComonent: FormatBoldIcon },
  { name: 'italic', key: 'ITALIC', iconComonent: FormatItalicIcon },
  { name: 'underline', key: 'UNDERLINE', iconComonent: FormatUnderlinedIcon },
  { name: 'code', key: 'CODE', iconComonent: CodeSharpIcon },
];

const SUPPORTED_BLOCK_TYPE = [
  { type: 'header-two', iconComonent: TitleIcon },
  { type: 'blockquote', iconComonent: FormatQuoteIcon },
  { type: 'code-block', iconComonent: DeveloperModeIcon },
  { type: 'ordered-list-item', iconComonent: FormatListNumberedIcon },
  { type: 'unordered-list-item', iconComonent: FormatListBulletedIcon },
];

const scrollWindowToTop = () => {
  window.scrollTo(0, 0);
};

const NoteEditor = ({ note, handleFinish, platform }) => {
  // dialog styles
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // text inputs states
  const [title, setTitle] = React.useState('');
  const [editorState, setEditorState] = React.useState(EMPTY_EDITOR_STATE);

  React.useEffect(() => {
    setTitle(note?.title || '');
    setEditorState(
      note ? EditorState.createWithContent(note.content) : EMPTY_EDITOR_STATE
    );
  }, [note]);

  const finishEditing = (e) => {
    if (e) {
      e.stopPropagation();
    }
    if (note) {
      handleFinish({
        id: note.id,
        title,
        content: editorState.getCurrentContent(),
      });
    }
  };

  // enhancing focus control ux
  const titleInputRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const focusEditor = () => editorRef.current?.focus();

  // get current editor styles
  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const locatedBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  // polish ios soft keyboard experience
  const [isIosKeyBoardOpened, setIosKeyBoardOpened] = React.useState(false);
  const [focusCount, setFocusCount] = React.useState(0);
  const isInputFocus = focusCount > 0;

  const incrementFocus = () => {
    setFocusCount((c) => c + 1);
  };
  const decrementFocus = () => {
    // setTimeout to handle focus immediatly after blur
    setTimeout(() => {
      setFocusCount((c) => c - 1);
    }, 30);
  };

  React.useEffect(() => {
    if (!IS_ON_IOS_SAFARI) {
      return;
    }
    if (isInputFocus) {
      // wait for keyboard popup
      setTimeout(() => {
        setIosKeyBoardOpened(true);
        window.addEventListener('scroll', scrollWindowToTop);
      }, 400);
    } else if (isIosKeyBoardOpened) {
      setIosKeyBoardOpened(false);
      window.scrollTo(0, 0);
      window.removeEventListener('scroll', scrollWindowToTop);
    }
  }, [isInputFocus]);

  const isOpen = !!note;
  React.useEffect(() => {
    if (isOpen) {
      editorRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      aria-labelledby="responsive-dialog-title"
      onClose={finishEditing}
      maxWidth="sm"
      PaperProps={{
        sx: {
          margin: 0,
          maxHeight: '100%',
          width: '100%',
          backgroundColor: theme.palette.secondary[200],
          ...(typeof window !== 'undefined' && isIosKeyBoardOpened
            ? {
                height: `${window.visualViewport.height}px`,
                paddingBottom: `${
                  window.outerHeight -
                  window.visualViewport.height -
                  (platform === 'telegram' ? 95 : 0)
                }px`,
                touchAction: 'none',
              }
            : {}),
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing(1, 2, 1, 3),
        }}
        onClick={() => titleInputRef.current?.focus()}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <InputBase
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ fontSize: 'x-large', fontWeight: 'bold' }}
            inputRef={titleInputRef}
            onFocus={incrementFocus}
            onBlur={decrementFocus}
          />
        </Typography>

        <IconButton
          sx={{ marginLeft: theme.spacing(1) }}
          color="inherit"
          aria-label="close editor"
          onClick={finishEditing}
        >
          <DoneIcon />
        </IconButton>
      </Box>

      <DialogContent
        onClick={focusEditor}
        sx={{
          minHeight: '5em',
          fontSize: 'larger',
          fontFamily: 'serif',
        }}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          onFocus={incrementFocus}
          onBlur={decrementFocus}
        />
      </DialogContent>

      <Box
        sx={{
          padding: theme.spacing(1),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'sticky',
        }}
        onClick={focusEditor}
      >
        <ToggleButtonGroup size="small">
          {SUPPORTED_BLOCK_TYPE.map(({ type, iconComonent: Icon }) => (
            <ToggleButton
              sx={{ border: 'none' }}
              component="span"
              aria-label={`format ${type}`}
              value={type}
              key={type}
              selected={locatedBlockType === type}
              onMouseDown={(e) => {
                e.preventDefault();
                setEditorState(RichUtils.toggleBlockType(editorState, type));
              }}
            >
              <Icon fontSize="small" />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ width: theme.spacing(2), flexShrink: 1 }} />
        <Divider flexItem orientation="vertical" />
        <Box sx={{ width: theme.spacing(2), flexShrink: 1 }} />

        <ToggleButtonGroup size="small">
          {SUPPORTED_INLINE_STYLE.map(({ name, key, iconComonent: Icon }) => (
            <ToggleButton
              sx={{ border: 'none' }}
              component="span"
              aria-label={`format ${name}`}
              value={name}
              key={key}
              selected={currentInlineStyle.has(key)}
              onMouseDown={(e) => {
                e.preventDefault();
                setEditorState(RichUtils.toggleInlineStyle(editorState, key));
              }}
            >
              <Icon fontSize="small" />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Dialog>
  );
};

export default NoteEditor;

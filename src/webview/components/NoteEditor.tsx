import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import DoneIcon from '@material-ui/icons/Done';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import TitleIcon from '@material-ui/icons/Title';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import CodeSharpIcon from '@material-ui/icons/CodeSharp';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import { Editor, RichUtils, EditorState } from 'draft-js';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const IS_ON_IOS_SAFARI =
  typeof window === 'object' &&
  /iPad|iPhone|iPod/.test(window.navigator.platform);

const useStyles = makeStyles<any, any>((theme) => ({
  dialogPaper: {
    margin: 0,
    maxHeight: '100%',
    width: '100%',
    backgroundColor: theme.palette.secondary[200],
  },
  titleInput: {
    fontSize: 'x-large',
    fontWeight: 'bold',
  },
  closeModalButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  editorContent: {
    minHeight: '5em',
    fontSize: 'larger',
    fontFamily: 'serif',
  },
  editorHeader: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2, 1, 3),
  },
  editorHeaderButton: {
    marginLeft: theme.spacing(1),
  },
  editorTitle: {
    flexGrow: 1,
  },
  editorFooter: {
    padding: theme.spacing(1),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorFooterButton: {
    border: 'none',
  },
  barSpacer: {
    width: theme.spacing(2),
    flexShrink: 1,
  },
}));

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

const NoteEditor = ({ note, handleFinish }) => {
  // dialog styles
  const classes = useStyles();
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

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

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
  const [focusCount, setFocusCount] = React.useState(0);
  const [
    iosKeyboardAdjustment,
    setIOSKeyboardAdjestments,
  ] = React.useState<null | Record<string, string>>(null);

  const setFocus = () => {
    setFocusCount((c) => c + 1);
  };

  const setBlur = () => {
    // setTimeout to handle focus immediatly after blur
    setTimeout(() => {
      setFocusCount((c) => c - 1);
    }, 30);
  };

  const isInputFocus = !!focusCount;
  React.useEffect(() => {
    if (!IS_ON_IOS_SAFARI) {
      return;
    }

    if (isInputFocus) {
      // wait for keyboard popup
      setTimeout(() => {
        const {
          outerHeight,
          visualViewport: { height: viewportHeight },
        } = window;

        setIOSKeyboardAdjestments({
          height: `${viewportHeight}px`,
          'padding-bottom': `${outerHeight - viewportHeight}px`,
          'touch-action': 'none',
        });
        window.addEventListener('scroll', scrollWindowToTop);
      }, 400);
    } else if (iosKeyboardAdjustment) {
      setIOSKeyboardAdjestments(null);
      window.scrollTo(0, 0);
      window.removeEventListener('scroll', scrollWindowToTop);
    }
  }, [isInputFocus]);

  return (
    <Dialog
      open={!!note}
      fullScreen={fullScreen}
      maxWidth="sm"
      onEnter={() => editorRef.current?.focus()}
      onClose={finishEditing}
      classes={{ paper: classes.dialogPaper }}
      aria-labelledby="responsive-dialog-title"
      PaperProps={
        iosKeyboardAdjustment ? { style: iosKeyboardAdjustment } : undefined
      }
    >
      <div
        className={classes.editorHeader}
        onClick={() => titleInputRef.current?.focus()}
      >
        <Typography variant="h6" className={classes.editorTitle}>
          <InputBase
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={classes.titleInput}
            inputRef={titleInputRef}
            onFocus={setFocus}
            onBlur={setBlur}
          />
        </Typography>

        {
          // <IconButton
          //   className={classes.editorHeaderButton}
          //   color="inherit"
          //   aria-label="editor actions"
          // >
          //   <MoreVertIcon />
          // </IconButton>
        }

        <IconButton
          className={classes.editorHeaderButton}
          color="inherit"
          aria-label="close editor"
          onClick={finishEditing}
        >
          <DoneIcon />
        </IconButton>
      </div>

      <DialogContent className={classes.editorContent} onClick={focusEditor}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          onFocus={setFocus}
          onBlur={setBlur}
        />
      </DialogContent>

      <div className={classes.editorFooter} onClick={focusEditor}>
        <ToggleButtonGroup size="small">
          {SUPPORTED_BLOCK_TYPE.map(({ type, iconComonent: Icon }) => (
            <ToggleButton
              className={classes.editorFooterButton}
              component="span"
              aria-label={`format ${type}`}
              value={type}
              key={type}
              selected={locatedBlockType === type}
              onMouseDown={(e) => {
                e.preventDefault();
                handleEditorChange(
                  RichUtils.toggleBlockType(editorState, type)
                );
              }}
            >
              <Icon fontSize="small" />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <div className={classes.barSpacer} />
        <Divider flexItem orientation="vertical" className={classes.divider} />
        <div className={classes.barSpacer} />

        <ToggleButtonGroup size="small">
          {SUPPORTED_INLINE_STYLE.map(({ name, key, iconComonent: Icon }) => (
            <ToggleButton
              className={classes.editorFooterButton}
              component="span"
              aria-label={`format ${name}`}
              value={name}
              key={key}
              selected={currentInlineStyle.has(key)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleEditorChange(
                  RichUtils.toggleInlineStyle(editorState, key)
                );
              }}
            >
              <Icon fontSize="small" />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </Dialog>
  );
};

export default NoteEditor;

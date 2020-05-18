import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(theme => ({
  closeModalButton: {
    position: 'absoFormatQuotelute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  editorWorkArea: {
    minHeight: '30em',
    fontSize: 'larger',
    fontFamily: 'serif',
    backgroundColor: theme.palette.secondary[100],
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
    justifyContent: 'space-around',
  },
  editorFooterButton: {
    border: 'none',
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

const NoteEditor = ({ editingContent, handleFinish }) => {
  const [editorState, setEditorState] = React.useState(EMPTY_EDITOR_STATE);

  React.useEffect(() => {
    if (editingContent) {
      setEditorState(EditorState.createWithContent(editingContent));
    } else {
      setEditorState(EMPTY_EDITOR_STATE);
    }
  }, [editingContent]);

  const handleEditorChange = state => {
    setEditorState(state);
  };

  const finishEditing = () => {
    handleFinish(editorState.getCurrentContent());
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const editorRef = React.useRef(null);
  const focusEditor = () => editorRef.current.focus();

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const locatedBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      open={!!editingContent}
      onEnter={() => editorRef.current.focus()}
      onClose={finishEditing}
      aria-labelledby="responsive-dialog-title"
    >
      <div className={classes.editorHeader}>
        <Typography variant="h6" className={classes.editorTitle}>
          New Note
        </Typography>
        <IconButton
          className={classes.editorHeaderButton}
          color="inherit"
          aria-label="editor actions"
        >
          <MoreVertIcon />
        </IconButton>
        <IconButton
          className={classes.editorHeaderButton}
          color="inherit"
          aria-label="close editor"
          onClick={finishEditing}
        >
          <DoneIcon />
        </IconButton>
      </div>

      <DialogContent
        dividers
        className={classes.editorWorkArea}
        onClick={focusEditor}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
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
              onMouseDown={e => {
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
        <Divider flexItem orientation="vertical" className={classes.divider} />

        <ToggleButtonGroup size="small">
          {SUPPORTED_INLINE_STYLE.map(({ name, key, iconComonent: Icon }) => (
            <ToggleButton
              className={classes.editorFooterButton}
              component="span"
              aria-label={`format ${name}`}
              value={name}
              key={key}
              selected={currentInlineStyle.has(key)}
              onMouseDown={e => {
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

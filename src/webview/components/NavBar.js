import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: theme.spacing(0, 2, 0, 0),
  },
  platformBadge: {
    width: 22,
    height: 22,
  },
  unknownPersonIcon: {
    width: '120%',
    height: '120%',
    marginBottom: theme.spacing(-1),
  },
  createButton: {
    margin: theme.spacing(0, 0, 0, 0.5),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: theme.palette.action.focus,
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const NavBar = ({ appData, handleAddNote, searchText, handleSearchChange }) => {
  const classes = useStyles();

  const profile = appData?.profile;
  const avatar = profile ? (
    <Badge
      overlap="circle"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <img
          alt={profile.platform}
          src={`/webview/static/platform_badge_${profile.platform}.png`}
          className={classes.platformBadge}
        />
      }
    >
      {profile.pictureURL ? (
        <Avatar src={profile.pictureURL} />
      ) : (
        <Avatar>{profile.name[0].toUpperCase()}</Avatar>
      )}
    </Badge>
  ) : (
    <Avatar>
      <PersonIcon className={classes.unknownPersonIcon} />
    </Avatar>
  );

  const spaceType = appData?.spaceType;

  return (
    <AppBar>
      <Toolbar>
        <div className={classes.avatar}>{avatar}</div>

        <Typography className={classes.title} variant="h5" noWrap>
          {spaceType === 'own'
            ? 'Your Own Wall'
            : spaceType === 'chat'
            ? 'Chat Wall'
            : spaceType === 'group'
            ? 'Group Wall'
            : ''}
        </Typography>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>

          <InputBase
            placeholder="Search…"
            value={searchText}
            onChange={e => handleSearchChange(e.target.value)}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>

        <IconButton
          disabled={!appData}
          onClick={handleAddNote}
          edge="end"
          className={classes.createButton}
          color="inherit"
          aria-label="add note"
        >
          <CreateIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

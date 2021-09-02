import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  createButton: {
    margin: theme.spacing(0, 0, 0, 0.5),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    marginLeft: theme.spacing(2),
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
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(4),
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
  searchRoot: {
    color: 'inherit',
  },
  searchInput: {
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
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
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
}));

const NavBar = ({ appData, handleAddNote, searchText, handleSearchChange }) => {
  const classes = useStyles();

  let avatarWidget;
  if (appData) {
    const { platform, profile } = appData;
    avatarWidget = (
      <Badge
        overlap="circle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <img
            alt={platform}
            src={`/webview/static/platform_badge_${platform}.png`}
            className={classes.platformBadge}
          />
        }
      >
        {!profile ? (
          <Avatar className={classes.avatar}>
            <PersonIcon className={classes.unknownPersonIcon} />
          </Avatar>
        ) : profile.avatarUrl ? (
          <Avatar src={profile.avatarUrl} className={classes.avatar} />
        ) : (
          <Avatar className={profile.avatarUrl}>
            {profile.name[0].toUpperCase()}
          </Avatar>
        )}
      </Badge>
    );
  } else {
    avatarWidget = (
      <Avatar className={classes.avatar}>
        <PersonIcon className={classes.unknownPersonIcon} />
      </Avatar>
    );
  }

  return (
    <AppBar>
      <Toolbar>
        {avatarWidget}
        <Typography className={classes.title} variant="h5" noWrap>
          {appData
            ? appData.isGroupChat
              ? 'Group Chat Space'
              : 'Your Own Space'
            : null}
        </Typography>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>

          <InputBase
            placeholder="Search…"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            classes={{
              root: classes.searchRoot,
              input: classes.searchInput,
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

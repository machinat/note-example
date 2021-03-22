import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  drawerPaper: {
    width: drawerWidth,
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

const SpaceDrawer = ({ open, setMenuOpen, profile }) => {
  const classes = useStyles();
  const theme = useTheme();

  const avatar = profile ? (
    <Badge
      overlap="circle"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <img
          alt={profile.platform}
          src={`/static/platform_badge_${profile.platform}.png`}
          className={classes.platformBadge}
        />
      }
    >
      {profile.avatar ? (
        <Avatar src={profile.avatar} className={classes.avatar} />
      ) : (
        <Avatar className={classes.avatar}>
          {profile.name[0].toUpperCase()}
        </Avatar>
      )}
    </Badge>
  ) : (
    <Avatar className={classes.avatar}>
      <PersonIcon className={classes.unknownPersonIcon} />
    </Avatar>
  );

  return (
    <>
      <SwipeableDrawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={open}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={() => setMenuOpen(false)}>
            <MenuIcon />
          </IconButton>
          {avatar}
        </Toolbar>

        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
    </>
  );
};

export default SpaceDrawer;

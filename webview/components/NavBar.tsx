import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { styled, useTheme } from '@mui/material/styles';

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(5),
  height: theme.spacing(5),
}));

const PlaceHolderPerson = styled(PersonIcon)(({ theme }) => ({
  width: '120%',
  height: '120%',
  marginBottom: theme.spacing(-1),
}));

const NavBar = ({ appData, handleAddNote, searchText, handleSearchChange }) => {
  const theme = useTheme();
  const profile = appData?.profile;

  const avatarWidget = appData ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <Box
          component="img"
          sx={{ width: 22, height: 22 }}
          alt={appData.platform}
          src={`/webview/static/platform_badge_${appData.platform}.png`}
        />
      }
    >
      {!profile ? (
        <UserAvatar>
          <PlaceHolderPerson />
        </UserAvatar>
      ) : profile.avatarUrl ? (
        <UserAvatar src={profile.avatarUrl} />
      ) : (
        <UserAvatar className={profile.avatarUrl}>
          {profile.name[0].toUpperCase()}
        </UserAvatar>
      )}
    </Badge>
  ) : (
    <UserAvatar>
      <PlaceHolderPerson />
    </UserAvatar>
  );

  return (
    <AppBar>
      <Toolbar>
        {avatarWidget}
        <Typography
          sx={{
            flexGrow: 1,
            display: 'none',
            marginLeft: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
              display: 'block',
            },
          }}
          variant="h5"
          noWrap
        >
          {appData
            ? appData.isGroupChat
              ? 'Group Chat Space'
              : 'Your Own Space'
            : null}
        </Typography>

        <Box
          sx={{
            position: 'relative',
            borderRadius: '5px',
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
              backgroundColor: theme.palette.action.focus,
            },
            marginLeft: theme.spacing(2),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
              marginLeft: theme.spacing(1),
              width: 'auto',
            },
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon />
          </Box>

          <InputBase
            placeholder="Search…"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            inputProps={{ 'aria-label': 'search' }}
            sx={{
              color: 'inherit',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                // vertical padding + font size from searchIcon
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                  width: '12ch',
                  '&:focus': {
                    width: '20ch',
                  },
                },
              },
            }}
          />
        </Box>

        <IconButton
          disabled={!appData}
          onClick={handleAddNote}
          edge="end"
          sx={{ margin: theme.spacing(0, 0, 0, 0.5) }}
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

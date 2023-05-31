import React from 'react';
import { Typography, Toolbar, Box, AppBar, List, ListItem, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import { AccountCircle, MusicNote, LibraryMusic } from '@mui/icons-material';



export const UpperBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='transparent'>
        <Toolbar sx={{ m: 'auto'}}>          
          <div className='logo_name'>
            <svg className='logo' width='40' height='40' viewBox="0 0 450 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1_10)">
                <path fillRule="evenodd" clipRule="evenodd" d="M225 0C101.25 0 0 101.25 0 225C0 348.75 101.25 450 225 450C348.75 450 450 348.75 450 225C450 101.25 348.75 0 225 0ZM225 405C126 405 45 324 45 225C45 126 126 45 225 45C324 45 405 126 405 225C405 324 324 405 225 405Z" fill="#6A80B1"/>
              </g>
              <g clipPath="url(#clip1_1_10)">
                <path d="M206.65 174.3C206.65 163.15 215.95 158.85 230.85 158.85C252.55 158.85 280.1 165.5 301.8 177.2V110.05C278.15 100.6 254.55 97 230.9 97C173.05 97 134.5 127.2 134.5 177.7C134.5 256.65 242.9 243.85 242.9 277.9C242.9 291.1 231.45 295.35 215.55 295.35C191.95 295.35 161.45 285.6 137.5 272.6V336.85C162.134 347.478 188.671 352.989 215.5 353.05C274.8 353.05 315.65 327.55 315.65 276.25C315.65 191.15 206.65 206.4 206.65 174.3Z" fill="#9EB0D4"/>
              </g>
              <defs>
                <clipPath id="clip0_1_10">
                  <rect width="450" height="450" fill="white"/>
                </clipPath>
                <clipPath id="clip1_1_10">
                  <rect width="192" height="256" fill="white" transform="translate(129 97)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <Typography 
            variant="h6"
            component="p"
            sx={{ ml: 1, cursor: 'pointer' }}
            color='white'
            textTransform="uppercase"
            align='center'
            display={'flex'}
            margin={'auto'}
            fontSize={34}
            fontWeight={'lighter'}
            >
              <MuiLink href="/main" underline="none" sx={{ color: 'white' }}>
                {'Sonus'}
              </MuiLink>
            </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export const SideBar = ({page}) => {
  return (
    <div className='clear leftbar' style={{display: 'flex'}}>
      <Box width={'135px'} height={'100vw'} sx={{ backgroundColor: '#232323' }}>
        <div className='clear' style={{ paddingTop: '21px', paddingLeft: '38px', paddingBottom: '190px' }}>
          <svg className='logo' width="65" height="65" viewBox="0 0 450 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1_10)">
                <path fillRule="evenodd" clipRule="evenodd" d="M225 0C101.25 0 0 101.25 0 225C0 348.75 101.25 450 225 450C348.75 450 450 348.75 450 225C450 101.25 348.75 0 225 0ZM225 405C126 405 45 324 45 225C45 126 126 45 225 45C324 45 405 126 405 225C405 324 324 405 225 405Z" fill="#6A80B1"/>
              </g>
              <g clipPath="url(#clip1_1_10)">
                <path d="M206.65 174.3C206.65 163.15 215.95 158.85 230.85 158.85C252.55 158.85 280.1 165.5 301.8 177.2V110.05C278.15 100.6 254.55 97 230.9 97C173.05 97 134.5 127.2 134.5 177.7C134.5 256.65 242.9 243.85 242.9 277.9C242.9 291.1 231.45 295.35 215.55 295.35C191.95 295.35 161.45 285.6 137.5 272.6V336.85C162.134 347.478 188.671 352.989 215.5 353.05C274.8 353.05 315.65 327.55 315.65 276.25C315.65 191.15 206.65 206.4 206.65 174.3Z" fill="#9EB0D4"/>
              </g>
              <defs>
                <clipPath id="clip0_1_10">
                  <rect width="450" height="450" fill="white"/>
                </clipPath>
                <clipPath id="clip1_1_10">
                  <rect width="192" height="256" fill="white" transform="translate(129 97)"/>
                </clipPath>
              </defs>
          </svg>
        </div>
        <List sx={{ margin: 'auto' }}>

          <ListItem disablePadding>
            <div className={page === 'library'? 'selection selected': 'selection'}>
              <Link to='/library' style={{ margin: 'auto', paddingTop: 0 }}>
                <ListItemButton sx={{ display: 'flex', minWidth: '135px', minHeight: '100%' }}>
                    <LibraryMusic className={page === 'library'? 'selected-icon icon': 'icon'} style={{ fontSize: 60 }}/>
                </ListItemButton>
              </Link>
            </div>
          </ListItem>

          <ListItem disablePadding>
            <div className={page === 'playlist'? 'selection selected': 'selection'}>
              <Link to='/playlist' style={{ margin: 'auto'}}>
                <ListItemButton sx={{ display: 'flex', minWidth: '135px' }}>
                  <MusicNote className={page === 'playlist'? 'selected-icon icon': 'icon'} style={{ fontSize: 60 }}/>
                </ListItemButton>
              </Link>
            </div>
          </ListItem>

          <ListItem disablePadding>
            <div className={page === 'profile'? 'selection selected': 'selection'}>
              <Link className='navbar-link' to='/profile' style={{ margin: 'auto'}}>
                <ListItemButton sx={{ display: 'flex', minWidth: '135px' }}>
                  <AccountCircle className={page === 'profile'? 'selected-icon icon': 'icon'} style={{ fontSize: 60 }}/>
                </ListItemButton>
              </Link>
            </div>
          </ListItem>

        </List>
      </Box>
    </div>
  );
};

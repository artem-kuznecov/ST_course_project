import { createTheme, styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

export const CustomTextField = styled(TextField)({
  // '& .MuiInput-underline': {
  //     borderBottomColor: 'blue',
  // },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
  // '& .MuiInput-underline:after': {
  //     borderBottomColor: 'white',
  // },
});

export const CustomSearchField = styled(TextField)({
  // '& .MuiInput-underline': {
  //     borderBottomColor: 'blue',
  // },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#757575',
  },
  // '& .MuiInput-underline:after': {
  //     borderBottomColor: 'white',
  // },
});

export const theme = createTheme({
    typography: {
      fontFamily: 'Ubuntu'
    },
    status: {
        danger: '#ff00ff',
      },
    palette: {
      primary: {
        main: '#232323',
        darker: '#ffffff',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
      newone: {
        main: 'white'
      },
      numbertwo: {
        main: 'red'
      },
      grey: {
        main: '#757575'
      }
    },
  });

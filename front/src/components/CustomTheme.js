import { createTheme, styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const CustomTextField = styled(TextField)({
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
});

export const CustomSearchField = styled(TextField)({
  '& .MuiInput-underline:before': {
    borderBottomColor: '#757575',
  },
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

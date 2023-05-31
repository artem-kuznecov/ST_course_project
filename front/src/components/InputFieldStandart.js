import { CustomTextField, CustomSearchField } from '../components/CustomTheme';

export const InputField = ({ header_name, elem_type, elem_name, handler, req, padBot, mT, wd }) => {
    return (
      <CustomTextField
        required={req}
        label={header_name}
        name={elem_name}
        color='newone'
        variant='standard'
        type={elem_type}
        fullWidth
        onChange={handler}
        sx={{ paddingBottom: padBot, marginTop: mT, width: wd }}
        InputLabelProps={{
            sx: {
              color: 'whitesmoke',
              textTransform: 'capitalize',
            },
          }}
        inputProps={{
            sx: {
                color: 'whitesmoke',
                fontSize: '20px',
                },
        }}
      />
    );
}

export const Search = ({ header_name, elem_type, elem_name, handler, req, padBot, mT, wd }) => {
  return (
    <CustomSearchField
      required={req}
      label={header_name}
      name={elem_name}
      color='newone'
      variant='standard'
      type={elem_type}
      fullWidth
      onChange={handler}
      sx={{ paddingBottom: padBot, marginTop: mT, width: wd }}
      InputLabelProps={{
          sx: {
            color: '#757575',
            textTransform: 'capitalize',
          },
        }}
      inputProps={{
          sx: {
              color: 'whitesmoke',
              fontSize: '20px',
              },
      }}
    />
  );
}
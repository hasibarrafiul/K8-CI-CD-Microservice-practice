import React, { useState } from 'react';
import { userApi } from '../api/axios';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  AppBar, Toolbar, Typography, Button, Container, TextField, 
  List, ListItem, ListItemText, Divider, Paper, InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    try {
      const response = await userApi.get(`/users/search?q=${query}`);
      setResults(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Engineer Search</Typography>
          <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSearch} size="large">Search</Button>
        </Paper>

        <Paper sx={{ mt: 3 }}>
          <List>
            {results.length > 0 ? results.map((user: any) => (
              <React.Fragment key={user.id}>
                <ListItem>
                  <ListItemText primary={user.email} secondary={`User ID: ${user.id}`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            )) : (
              <Typography sx={{ p: 3, textAlign: 'center' }}>No results found</Typography>
            )}
          </List>
        </Paper>
      </Container>
    </>
  );
};
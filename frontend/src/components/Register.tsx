import React, { useState } from 'react';
import { authApi } from '../api/axios';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';

export const Register = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.post('/auth/register', { email, password });
      setSuccess(true);
      setTimeout(() => onSwitch(), 2000); // Redirect to login after 2 seconds
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          {success && <Alert severity="success">Registered! Redirecting to login...</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth label="Email Address" onChange={(e) => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
              Register
            </Button>
            <Link href="#" variant="body2" onClick={onSwitch}>
              Already have an account? Sign In
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
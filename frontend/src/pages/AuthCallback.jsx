import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) { navigate('/'); return; }
    localStorage.setItem('token', token);
    getProfile()
      .then(user => { login(token, user); navigate('/projects'); })
      .catch(() => navigate('/'));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
      <CircularProgress color="secondary" />
      <Typography>Signing you in...</Typography>
    </Box>
  );
}

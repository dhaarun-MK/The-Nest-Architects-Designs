import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { adminLogin } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      loginAdmin(data.access_token);
      navigate('/admin');
    },
    onError: () => toast.error('Invalid credentials'),
  });

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="primary.main">
      <Paper sx={{ p: 5, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" fontFamily="Playfair Display" fontWeight={700} textAlign="center" mb={1}>
          THE NEST ARCHITECTS
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>Admin Panel</Typography>

        <Box component="form" onSubmit={handleSubmit(data => mutate({ username: data.username, password: data.password }))}>
          <TextField fullWidth label="Username" sx={{ mb: 2 }} {...register('username', { required: true })} error={!!errors.username} />
          <TextField
            fullWidth label="Password" sx={{ mb: 3 }}
            type={showPass ? 'text' : 'password'}
            {...register('password', { required: true })}
            error={!!errors.password}
            InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(s => !s)}>{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isPending}>
            {isPending ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

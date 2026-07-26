import { Container, Typography, Grid, Box, TextField, Button, Paper, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { submitContact } from '../api';
import { toast } from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: submitContact,
    onSuccess: () => { toast.success('Message sent successfully!'); reset(); },
    onError: () => toast.error('Failed to send message. Please try again.'),
  });

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" textAlign="center" mb={1}>Contact Us</Typography>
      <Typography textAlign="center" color="text.secondary" mb={6}>We'd love to hear from you</Typography>

      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Typography variant="h5" mb={3}>Get In Touch</Typography>
          {[
            [<EmailIcon />, 'Email', 'jeyaamani99@gmail.com'],
            [<PhoneIcon />, 'Phone', '+91 76396 87678'],
            [<LocationOnIcon />, 'Location', 'Sivaganga, Tamil Nadu, India'],
          ].map(([icon, label, value]) => (
            <Box key={label} display="flex" gap={2} mb={3} alignItems="flex-start">
              <Box sx={{ color: 'secondary.main', mt: 0.5 }}>{icon}</Box>
              <Box>
                <Typography fontWeight={600}>{label}</Typography>
                <Typography color="text.secondary">{value}</Typography>
              </Box>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(data => mutate(data))}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Email is required' })} error={!!errors.email} helperText={errors.email?.message} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone" {...register('phone')} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Subject" {...register('subject', { required: 'Subject is required' })} error={!!errors.subject} helperText={errors.subject?.message} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Message" multiline rows={5} {...register('message', { required: 'Message is required' })} error={!!errors.message} helperText={errors.message?.message} />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={isPending}>
                    {isPending ? <CircularProgress size={24} /> : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

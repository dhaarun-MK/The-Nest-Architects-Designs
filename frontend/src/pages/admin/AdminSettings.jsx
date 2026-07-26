import { Box, Typography, Paper, TextField, Button, Grid, CircularProgress, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../api';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminSettings() {
  const qc = useQueryClient();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [faviconRemoved, setFaviconRemoved] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (data) {
      reset(data);
      if (!logoRemoved) setLogoPreview(data.logo || null);
      if (!faviconRemoved) setFaviconPreview(data.favicon || null);
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      if (logoFile) fd.append('logo', logoFile);
      else if (logoRemoved) fd.append('remove_logo', 'true');
      if (faviconFile) fd.append('favicon', faviconFile);
      else if (faviconRemoved) fd.append('remove_favicon', 'true');
      return updateSettings(fd);
    },
    onSuccess: () => { toast.success('Settings saved!'); setLogoRemoved(false); setFaviconRemoved(false); qc.invalidateQueries(['settings']); },
    onError: () => toast.error('Save failed'),
  });

  if (isLoading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Settings</Typography>
      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit(mutate)}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600}>Company Details</Typography><Divider /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Company Name" {...register('company_name')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email" {...register('email')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" {...register('phone')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Footer Text" {...register('footer_text')} /></Grid>

            <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600} mt={1}>Social Links</Typography><Divider /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Facebook URL" {...register('facebook')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Instagram URL" {...register('instagram')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="LinkedIn URL" {...register('linkedin')} /></Grid>

            {/* <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600} mt={1}>SMTP Configuration</Typography><Divider /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP Host" {...register('smtp_host')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP Port" {...register('smtp_port')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP User" {...register('smtp_user')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP Password" type="password" {...register('smtp_pass')} /></Grid> */}

            <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600} mt={1}>Branding</Typography><Divider /></Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Logo</Typography>
              {logoPreview && (
                <Box position="relative" display="inline-block" mb={1}>
                  <img src={logoPreview} alt="logo" style={{ height: 40, display: 'block' }} />
                  <IconButton size="small" onClick={() => { setLogoPreview(null); setLogoFile(null); setLogoRemoved(true); }} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: '#fff', p: '2px', '&:hover': { bgcolor: 'error.dark' } }}>
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              )}
              <input type="file" accept="image/*" onChange={e => { setLogoFile(e.target.files[0]); setLogoPreview(URL.createObjectURL(e.target.files[0])); setLogoRemoved(false); }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Favicon</Typography>
              {faviconPreview && (
                <Box position="relative" display="inline-block" mb={1}>
                  <img src={faviconPreview} alt="favicon" style={{ height: 40, display: 'block' }} />
                  <IconButton size="small" onClick={() => { setFaviconPreview(null); setFaviconFile(null); setFaviconRemoved(true); }} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: '#fff', p: '2px', '&:hover': { bgcolor: 'error.dark' } }}>
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              )}
              <input type="file" accept="image/*" onChange={e => { setFaviconFile(e.target.files[0]); setFaviconPreview(URL.createObjectURL(e.target.files[0])); setFaviconRemoved(false); }} />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="secondary" size="large" disabled={isPending}>
                {isPending ? <CircularProgress size={20} /> : 'Save Settings'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

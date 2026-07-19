import { Box, Typography, Paper, TextField, Button, Grid, CircularProgress, Divider } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../../api';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminSettings() {
  const qc = useQueryClient();
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getSettings });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (data) reset(data); }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      if (logoFile) fd.append('logo', logoFile);
      if (faviconFile) fd.append('favicon', faviconFile);
      return updateSettings(fd);
    },
    onSuccess: () => { toast.success('Settings saved!'); qc.invalidateQueries(['settings']); },
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

            <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600} mt={1}>SMTP Configuration</Typography><Divider /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP Host" {...register('smtp_host')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP Port" {...register('smtp_port')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP User" {...register('smtp_user')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="SMTP Password" type="password" {...register('smtp_pass')} /></Grid>

            <Grid item xs={12}><Typography variant="subtitle1" fontWeight={600} mt={1}>Branding</Typography><Divider /></Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Logo</Typography>
              {data?.logo && <img src={data.logo} alt="logo" style={{ height: 40, display: 'block', marginBottom: 4 }} />}
              <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Favicon</Typography>
              {data?.favicon && <img src={data.favicon} alt="favicon" style={{ height: 40, display: 'block', marginBottom: 4 }} />}
              <input type="file" accept="image/*" onChange={e => setFaviconFile(e.target.files[0])} />
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

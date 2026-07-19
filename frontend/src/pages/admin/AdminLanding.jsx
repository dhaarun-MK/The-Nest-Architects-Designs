import { Box, Typography, Paper, TextField, Button, Grid, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLanding, updateLanding } from '../../api';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminLanding() {
  const qc = useQueryClient();
  const [heroFile, setHeroFile] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ['landing'], queryFn: getLanding });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (data) reset(data); }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      if (heroFile) fd.append('hero_image', heroFile);
      return updateLanding(fd);
    },
    onSuccess: () => { toast.success('Landing page updated!'); qc.invalidateQueries(['landing']); },
    onError: () => toast.error('Update failed'),
  });

  if (isLoading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Landing Page Management</Typography>
      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit(mutate)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Company Name" {...register('company_name')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Tagline" {...register('tagline')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Overview" {...register('overview')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth multiline rows={3} label="Mission" {...register('mission')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth multiline rows={3} label="Vision" {...register('vision')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Primary Button Text" {...register('cta_primary')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Secondary Button Text" {...register('cta_secondary')} /></Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" mb={1}>Hero Background Image</Typography>
              {data?.hero_image && <img src={data.hero_image} alt="hero" style={{ height: 100, borderRadius: 8, marginBottom: 8, display: 'block' }} />}
              <input type="file" accept="image/*" onChange={e => setHeroFile(e.target.files[0])} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="secondary" disabled={isPending}>
                {isPending ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

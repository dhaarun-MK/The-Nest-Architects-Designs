import { Box, Typography, Paper, TextField, Button, Grid, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLanding, updateLanding } from '../../api';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminLanding() {
  const qc = useQueryClient();
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [heroRemoved, setHeroRemoved] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['landing'], queryFn: getLanding });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (data) {
      reset(data);
      if (!heroRemoved) setHeroPreview(data.hero_image || null);
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v !== undefined && fd.append(k, v));
      if (heroFile) fd.append('hero_image', heroFile);
      else if (heroRemoved) fd.append('remove_hero_image', 'true');
      return updateLanding(fd);
    },
    onSuccess: () => { toast.success('Landing page updated!'); setHeroRemoved(false); qc.invalidateQueries(['landing']); },
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
              {heroPreview && (
                <Box mb={1} position="relative" display="inline-block">
                  <img src={heroPreview} alt="hero" style={{ height: 100, borderRadius: 8, display: 'block' }} />
                  <IconButton
                    size="small"
                    onClick={() => { setHeroPreview(null); setHeroFile(null); setHeroRemoved(true); }}
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: '#fff', p: '2px', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              )}
              <input type="file" accept="image/*" onChange={e => { setHeroFile(e.target.files[0]); setHeroPreview(URL.createObjectURL(e.target.files[0])); setHeroRemoved(false); }} />
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

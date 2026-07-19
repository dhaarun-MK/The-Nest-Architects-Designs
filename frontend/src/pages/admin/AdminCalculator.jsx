import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch, FormControlLabel, CircularProgress, Tabs, Tab, Tooltip } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllServices, createService, updateService, deleteService } from '../../api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const PROJECT_TYPES = ['Villa', 'House', 'Interior', 'Commercial', 'Office', 'Apartment', 'School', 'Hospital'];

export default function AdminCalculator() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState(0);
  const { data: services = [], isLoading } = useQuery({ queryKey: ['services-admin'], queryFn: getAllServices });
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const onSuccess = () => { toast.success('Saved!'); qc.invalidateQueries(['services-admin']); setOpen(false); reset(); setEditing(null); };

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data) => {
      const project_type_pricing = {};
      PROJECT_TYPES.forEach(pt => {
        const val = data[`ptp_${pt}`];
        if (val !== '' && val != null) project_type_pricing[pt] = Number(val);
      });
      const payload = { service: data.service, price_per_sqft: data.price_per_sqft, discount: data.discount, is_visible: data.is_visible, project_type_pricing };
      return editing ? updateService(editing.id, payload) : createService(payload);
    },
    onSuccess, onError: () => toast.error('Failed'),
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteService,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['services-admin']); },
  });

  const openEdit = (s) => {
    setEditing(s);
    setValue('service', s.service);
    setValue('price_per_sqft', s.price_per_sqft);
    setValue('discount', s.discount);
    setValue('is_visible', s.is_visible);
    PROJECT_TYPES.forEach(pt => setValue(`ptp_${pt}`, s.project_type_pricing?.[pt] ?? ''));
    setOpen(true);
  };
  const openCreate = () => { setEditing(null); reset(); setOpen(true); };

  const activeType = PROJECT_TYPES[tab - 1];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Calculator Services</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>Add Service</Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        <Tab label="Default" />
        {PROJECT_TYPES.map(pt => <Tab key={pt} label={pt} />)}
      </Tabs>

      <Paper>
        {isLoading ? <Box p={4} textAlign="center"><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>{tab === 0 ? 'Default Price/sqft (₹)' : `${activeType} Price/sqft (₹)`}</TableCell>
                <TableCell>Discount (%)</TableCell>
                <TableCell>Visible</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map(s => {
                const typePrice = tab > 0 ? s.project_type_pricing?.[activeType] : null;
                return (
                  <TableRow key={s.id}>
                    <TableCell>{s.service}</TableCell>
                    <TableCell>
                      {tab === 0
                        ? `₹${s.price_per_sqft}`
                        : typePrice != null
                          ? <Tooltip title={`Default: ₹${s.price_per_sqft}`}><span>₹{typePrice} <Typography component="span" variant="caption" color="text.secondary">(custom)</Typography></span></Tooltip>
                          : <Typography color="text.secondary" variant="body2">₹{s.price_per_sqft} (default)</Typography>
                      }
                    </TableCell>
                    <TableCell>{s.discount}%</TableCell>
                    <TableCell>{s.is_visible ? '✅' : '❌'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => { if (confirm('Delete?')) remove(s.id); }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="service-form" onSubmit={handleSubmit(save)} mt={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Service Name" {...register('service', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Default Price per sqft (₹)" type="number" inputProps={{ step: '0.01' }} {...register('price_per_sqft', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Discount (%)" type="number" {...register('discount')} /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel control={<Switch defaultChecked {...register('is_visible')} />} label="Visible" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>Project Type Overrides (leave blank to use default)</Typography>
                <Grid container spacing={2}>
                  {PROJECT_TYPES.map(pt => (
                    <Grid item xs={6} sm={3} key={pt}>
                      <TextField fullWidth label={`${pt} (₹/sqft)`} type="number" inputProps={{ step: '0.01' }} size="small" {...register(`ptp_${pt}`)} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="service-form" variant="contained" color="secondary" disabled={isPending}>
            {isPending ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

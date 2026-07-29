import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch, FormControlLabel, CircularProgress, Tabs, Tab, Tooltip, Divider, MenuItem, Select, InputLabel, FormControl as MuiFormControl } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectTypes, addProjectType, deleteProjectType, getAllServicesForType, addService, updateService, deleteService } from '../../api';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const CATEGORIES = ['Architecture', 'Engineering', 'Interior', 'Exterior', 'Visualization', 'Consultation'];
const EMPTY_ROW = () => ({ serviceName: '', price_per_sqft: '', category: '', customCategory: '', discount: 0, is_visible: true });

export default function AdminCalculator() {
  const qc = useQueryClient();
  const [tab, setTab] = useState(0);
  const [svcOpen, setSvcOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [typeServices, setTypeServices] = useState([EMPTY_ROW()]);

  const { data: projectTypes = [] } = useQuery({ queryKey: ['project-types'], queryFn: getProjectTypes });
  const activeType = projectTypes[tab] ?? null;

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-admin', activeType?.id],
    queryFn: () => getAllServicesForType(activeType.id),
    enabled: !!activeType,
  });

  const { register, handleSubmit, reset, setValue, control, watch } = useForm();
  const watchedCategory = watch('category');

  const onSvcSuccess = () => {
    toast.success('Saved!');
    qc.invalidateQueries(['services-admin', activeType?.id]);
    setSvcOpen(false); reset(); setEditing(null);
  };

  const { mutate: saveService, isPending } = useMutation({
    mutationFn: (data) => {
      const payload = {
        serviceName: data.serviceName,
        price_per_sqft: Number(data.price_per_sqft) || 0,
        discount: Number(data.discount) || 0,
        is_visible: data.is_visible,
        category: data.category === 'Other' ? (data.customCategory || '') : (data.category || ''),
      };
      return editing ? updateService(editing.id, payload) : addService(activeType.id, payload);
    },
    onSuccess: onSvcSuccess,
    onError: () => toast.error('Failed'),
  });

  const { mutate: removeSvc } = useMutation({
    mutationFn: deleteService,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['services-admin', activeType?.id]); },
  });

  const { mutate: removeType } = useMutation({
    mutationFn: deleteProjectType,
    onSuccess: () => { toast.success('Type deleted'); qc.invalidateQueries(['project-types']); setTab(0); },
    onError: () => toast.error('Failed to delete type'),
  });

  const resolvedCategory = (row) => row.category === 'Other' ? (row.customCategory || '') : row.category;

  const { mutate: createType, isPending: addingType } = useMutation({
    mutationFn: () => {
      const name = newTypeName.trim();
      if (!name) throw new Error('Name required');
      const filled = typeServices.filter(s => s.serviceName?.trim());
      const invalid = filled.filter(s => s.price_per_sqft === '' || s.price_per_sqft == null);
      if (invalid.length) throw new Error('Fill price for all named services');
      return addProjectType(name, filled.map(s => ({ ...s, category: resolvedCategory(s) })));
    },
    onSuccess: () => {
      toast.success('Project type added!');
      qc.invalidateQueries(['project-types']);
      setAddTypeOpen(false); setNewTypeName('');
      setTypeServices([EMPTY_ROW()]);
    },
    onError: (e) => toast.error(e.message || 'Failed'),
  });

  const openEdit = (s) => {
    setEditing(s);
    setValue('serviceName', s.serviceName);
    setValue('price_per_sqft', s.price_per_sqft);
    setValue('discount', s.discount);
    setValue('is_visible', s.is_visible);
    const isKnown = CATEGORIES.includes(s.category);
    setValue('category', isKnown ? s.category : (s.category ? 'Other' : ''));
    setValue('customCategory', isKnown ? '' : s.category);
    setSvcOpen(true);
  };

  const openCreate = () => { setEditing(null); reset({ is_visible: true, discount: 0, price_per_sqft: 0, category: '' }); setSvcOpen(true); };

  const updateTypeServiceRow = (i, field, value) => {
    setTypeServices(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Calculator Services</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={() => setAddTypeOpen(true)}>Add Project Type</Button>
          {activeType && <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>Add Service</Button>}
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {projectTypes.map(pt => <Tab key={pt.id} label={pt.name} />)}
        </Tabs>
        {activeType && (
          <Tooltip title={`Delete "${activeType.name}" project type`}>
            <IconButton size="small" color="error" onClick={() => { if (confirm(`Delete project type "${activeType.name}"? All its services will be deleted.`)) removeType(activeType.id); }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {!activeType ? (
        <Typography color="text.secondary">No project types yet. Add one to get started.</Typography>
      ) : (
        <Paper>
          {isLoading ? <Box p={4} textAlign="center"><CircularProgress /></Box> : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price/sqft (₹)</TableCell>
                  <TableCell>Discount (%)</TableCell>
                  <TableCell>Visible</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.serviceName}</TableCell>
                    <TableCell>{s.category || '—'}</TableCell>
                    <TableCell>₹{s.price_per_sqft}</TableCell>
                    <TableCell>{s.discount}%</TableCell>
                    <TableCell>{s.is_visible ? '✅' : '❌'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => { if (confirm('Delete this service?')) removeSvc(s.id); }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {services.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center"><Typography color="text.secondary" py={2}>No services yet.</Typography></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      {/* Add / Edit Service Dialog */}
      <Dialog open={svcOpen} onClose={() => setSvcOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Service' : `Add Service to ${activeType?.name}`}</DialogTitle>
        <DialogContent>
          <Box component="form" id="svc-form" onSubmit={handleSubmit(d => saveService(d))} mt={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Service Name" {...register('serviceName', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}>
                <MuiFormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Controller name="category" control={control} defaultValue="" render={({ field }) => (
                    <Select {...field} label="Category">
                      {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  )} />
                </MuiFormControl>
              </Grid>
              {watchedCategory === 'Other' && (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Custom Category" {...register('customCategory')} />
                </Grid>
              )}
              <Grid item xs={12} sm={6}><TextField fullWidth label="Price per sqft (₹)" type="number" inputProps={{ step: '0.01', min: 0 }} {...register('price_per_sqft')} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Discount (%)" type="number" defaultValue={0} {...register('discount')} /></Grid>
              <Grid item xs={12} sm={6}><FormControlLabel control={<Switch defaultChecked {...register('is_visible')} />} label="Visible" /></Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSvcOpen(false)}>Cancel</Button>
          <Button type="submit" form="svc-form" variant="contained" color="secondary" disabled={isPending}>
            {isPending ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Project Type Dialog */}
      <Dialog open={addTypeOpen} onClose={() => setAddTypeOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Project Type</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Project Type Name" value={newTypeName} onChange={e => setNewTypeName(e.target.value)} sx={{ mt: 1, mb: 3 }} />
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle2">Services for this project type</Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={() => setTypeServices(prev => [...prev, EMPTY_ROW()])}>
              Add Row
            </Button>
          </Box>
          <Grid container spacing={1} mb={1}>
            <Grid item xs={3.5}><Typography variant="caption" fontWeight={600}>Service Name</Typography></Grid>
            <Grid item xs={3}><Typography variant="caption" fontWeight={600}>Category</Typography></Grid>
            <Grid item xs={2}><Typography variant="caption" fontWeight={600}>Price/sqft (₹)</Typography></Grid>
            <Grid item xs={2}><Typography variant="caption" fontWeight={600}>Discount (%)</Typography></Grid>
            <Grid item xs={1.5} />
          </Grid>
          {typeServices.map((s, i) => (
            <Box key={i} mb={1}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={3.5}>
                  <TextField fullWidth size="small" placeholder="Service Name" value={s.serviceName} onChange={e => updateTypeServiceRow(i, 'serviceName', e.target.value)} />
                </Grid>
                <Grid item xs={3}>
                  <Select fullWidth size="small" value={s.category} onChange={e => updateTypeServiceRow(i, 'category', e.target.value)} displayEmpty>
                    <MenuItem value=""><em>Select</em></MenuItem>
                    {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={2}>
                  <TextField fullWidth size="small" type="number" inputProps={{ step: '0.01', min: 0 }} placeholder="0" value={s.price_per_sqft} onChange={e => updateTypeServiceRow(i, 'price_per_sqft', e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                  <TextField fullWidth size="small" type="number" inputProps={{ min: 0, max: 100 }} placeholder="0" value={s.discount} onChange={e => updateTypeServiceRow(i, 'discount', e.target.value)} />
                </Grid>
                <Grid item xs={1.5}>
                  <IconButton size="small" color="error" disabled={typeServices.length === 1} onClick={() => setTypeServices(prev => prev.filter((_, idx) => idx !== i))}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              {s.category === 'Other' && (
                <Box mt={1} pl={0}>
                  <TextField fullWidth size="small" label="Custom Category" placeholder="Type category name" value={s.customCategory} onChange={e => updateTypeServiceRow(i, 'customCategory', e.target.value)} />
                </Box>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTypeOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={() => createType()} disabled={!newTypeName.trim() || addingType}>
            {addingType ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

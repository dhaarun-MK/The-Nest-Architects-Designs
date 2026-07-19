import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch, FormControlLabel, CircularProgress, Tabs, Tab, Tooltip, Divider } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllServices, createService, updateService, deleteService, getProjectTypes, addProjectType, deleteProjectType } from '../../api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function AdminCalculator() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState(0);
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [typePrices, setTypePrices] = useState({});

  const { data: services = [], isLoading } = useQuery({ queryKey: ['services-admin'], queryFn: getAllServices });
  const { data: projectTypes = [] } = useQuery({ queryKey: ['project-types'], queryFn: getProjectTypes });
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const typeNames = projectTypes.map(pt => pt.name);
  const defaultPriceSqft = watch('price_per_sqft');

  const onSuccess = () => { toast.success('Saved!'); qc.invalidateQueries(['services-admin']); setOpen(false); reset(); setEditing(null); };

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data) => {
      const project_type_pricing = {};
      typeNames.forEach(pt => {
        const val = data[`ptp_${pt}`];
        if (val !== '' && val != null) project_type_pricing[pt] = Number(val);
      });
      const payload = {
        service: data.service,
        price_per_sqft: data.price_per_sqft !== '' && data.price_per_sqft != null ? Number(data.price_per_sqft) : 0,
        discount: data.discount || 0,
        is_visible: data.is_visible,
        project_type_pricing,
      };
      return editing ? updateService(editing.id, payload) : createService(payload);
    },
    onSuccess, onError: () => toast.error('Failed'),
  });

  const handleSave = (data) => {
    if (!editing) {
      const missing = typeNames.filter(pt => data[`ptp_${pt}`] === '' || data[`ptp_${pt}`] == null);
      if (missing.length > 0) return toast.error(`Set price for: ${missing.join(', ')}`);
    }
    save(data);
  };

  const { mutate: remove } = useMutation({
    mutationFn: deleteService,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['services-admin']); },
  });

  const { mutate: removeType } = useMutation({
    mutationFn: deleteProjectType,
    onSuccess: () => { toast.success('Type deleted'); qc.invalidateQueries(['project-types']); setTab(0); },
    onError: () => toast.error('Failed to delete type'),
  });

  // Add Project Type: save type name + update all services with the entered prices
  const { mutate: addType, isPending: addingType } = useMutation({
    mutationFn: async () => {
      const name = newTypeName.trim();
      if (!name) throw new Error('Name required');
      // Validate all service prices filled
      const missing = services.filter(s => typePrices[s.id] === '' || typePrices[s.id] == null);
      if (missing.length > 0) throw new Error(`Set price for: ${missing.map(s => s.service).join(', ')}`);
      // Create the project type
      await addProjectType(name);
      // Update each service's project_type_pricing
      await Promise.all(services.map(s => {
        const updated = { ...s.project_type_pricing, [name]: Number(typePrices[s.id]) };
        return updateService(s.id, { ...s, project_type_pricing: updated });
      }));
    },
    onSuccess: () => {
      toast.success('Project type added!');
      qc.invalidateQueries(['project-types']);
      qc.invalidateQueries(['services-admin']);
      setAddTypeOpen(false);
      setNewTypeName('');
      setTypePrices({});
    },
    onError: (e) => toast.error(e.message || 'Failed to add type'),
  });

  const openAddType = () => {
    // Pre-fill prices with each service's default price_per_sqft
    const defaults = {};
    services.forEach(s => { defaults[s.id] = s.price_per_sqft; });
    setTypePrices(defaults);
    setNewTypeName('');
    setAddTypeOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setValue('service', s.service);
    setValue('price_per_sqft', s.price_per_sqft);
    setValue('discount', s.discount);
    setValue('is_visible', s.is_visible);
    typeNames.forEach(pt => setValue(`ptp_${pt}`, s.project_type_pricing?.[pt] ?? ''));
    setOpen(true);
  };
  const openCreate = () => { setEditing(null); reset(); setOpen(true); };

  const activeType = tab > 0 ? typeNames[tab - 1] : null;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Calculator Services</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={openAddType}>Add Project Type</Button>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>Add Service</Button>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Default" />
          {projectTypes.map(pt => <Tab key={pt.id} label={pt.name} />)}
        </Tabs>
        {tab > 0 && activeType && (
          <Tooltip title={`Delete "${activeType}" project type`}>
            <IconButton size="small" color="error" onClick={() => { if (confirm(`Delete project type "${activeType}"?`)) removeType(projectTypes[tab - 1].id); }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

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

      {/* Add / Edit Service Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="service-form" onSubmit={handleSubmit(handleSave)} mt={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Service Name" {...register('service', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Default Price per sqft (₹)" type="number" inputProps={{ step: '0.01', min: 0 }} defaultValue={0} {...register('price_per_sqft')} />
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Discount (%)" type="number" defaultValue={0} {...register('discount')} /></Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel control={<Switch defaultChecked {...register('is_visible')} />} label="Visible" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color={!editing ? 'error' : 'text.secondary'} mb={1}>
                  Project Type Prices (₹/sqft){!editing ? ' — required for all types' : ' — leave blank to use default'}
                </Typography>
                {typeNames.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No project types defined yet.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {typeNames.map(pt => (
                      <Grid item xs={6} sm={3} key={pt}>
                        <TextField
                          fullWidth label={`${pt} (₹/sqft)`} type="number"
                          inputProps={{ step: '0.01', min: 0 }} size="small"
                          required={!editing}
                          placeholder={!editing ? String(defaultPriceSqft || 0) : ''}
                          {...register(`ptp_${pt}`, { required: !editing })}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
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

      {/* Add Project Type Dialog */}
      <Dialog open={addTypeOpen} onClose={() => setAddTypeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Project Type</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Project Type Name" value={newTypeName}
            onChange={e => setNewTypeName(e.target.value)} sx={{ mt: 1, mb: 3 }}
          />
          {services.length > 0 && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="error" mb={2}>
                Set price per sqft for each service — required (defaults to service's default price)
              </Typography>
              <Grid container spacing={2}>
                {services.map(s => (
                  <Grid item xs={12} sm={6} key={s.id}>
                    <TextField
                      fullWidth
                      label={`${s.service} (₹/sqft)`}
                      type="number"
                      inputProps={{ step: '0.01', min: 0 }}
                      size="small"
                      value={typePrices[s.id] ?? s.price_per_sqft}
                      onChange={e => setTypePrices(prev => ({ ...prev, [s.id]: e.target.value }))}
                      helperText={`Default: ₹${s.price_per_sqft}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTypeOpen(false)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={() => addType()} disabled={!newTypeName.trim() || addingType}>
            {addingType ? <CircularProgress size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

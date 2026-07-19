import { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem, Chip, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, createProject, updateProject, deleteProject } from '../../api';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const CATEGORIES = ['Villa', 'House', 'Interior', 'Commercial', 'Office', 'Apartment', 'School', 'Hospital'];
const FORM_FIELDS = ['title', 'category', 'description', 'location', 'budget', 'duration', 'client_name', 'completed_date', 'status', 'materials_used', 'challenges', 'testimonial'];

export default function AdminProjects() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [removeGalleryIds, setRemoveGalleryIds] = useState([]);

  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { register, handleSubmit, reset, setValue } = useForm();

  const onSuccess = () => {
    toast.success('Saved!');
    qc.invalidateQueries(['projects']);
    setOpen(false);
    reset();
    setEditing(null);
    setCoverFile(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setExistingGallery([]);
    setRemoveGalleryIds([]);
  };
  const onError = (err) => {
    console.error(err);
    toast.error('Operation failed');
  };

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data) => {
      const fd = new FormData();
      FORM_FIELDS.forEach(k => { if (data[k] !== undefined && data[k] !== null) fd.append(k, data[k]); });
      if (coverFile) fd.append('cover', coverFile);
      galleryFiles.forEach(f => fd.append('gallery', f));
      if (removeGalleryIds.length) fd.append('remove_gallery_ids', removeGalleryIds.join(','));
      return editing ? updateProject(editing.id, fd) : createProject(fd);
    },
    onSuccess,
    onError,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['projects']); },
  });

  const openEdit = (project) => {
    setEditing(project);
    FORM_FIELDS.forEach(k => setValue(k, project[k] ?? ''));
    setCoverFile(null);
    setCoverPreview(project.cover_image || null);
    setGalleryFiles([]);
    setExistingGallery(project.gallery ?? []);
    setRemoveGalleryIds([]);
    setOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    reset();
    setCoverFile(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setExistingGallery([]);
    setRemoveGalleryIds([]);
    setOpen(true);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeExistingGalleryImg = (imgId) => {
    setExistingGallery(prev => prev.filter(img => img.id !== imgId));
    setRemoveGalleryIds(prev => [...prev, imgId]);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Projects</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>Add Project</Button>
      </Box>

      <Paper>
        {isLoading ? <Box p={4} textAlign="center"><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell><Chip label={p.category} size="small" /></TableCell>
                  <TableCell>{p.location}</TableCell>
                  <TableCell>₹{Number(p.budget).toLocaleString('en-IN')}</TableCell>
                  <TableCell><Chip label={p.status} size="small" color={p.status === 'active' ? 'success' : 'default'} /></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => { if (confirm('Delete?')) remove(p.id); }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="project-form" onSubmit={handleSubmit(save)} mt={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Title" {...register('title', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Category" defaultValue="" {...register('category', { required: true })}>
                  {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" {...register('description', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Location" {...register('location', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Budget (₹)" type="number" {...register('budget', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Duration" {...register('duration', { required: true })} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Client Name" {...register('client_name')} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Completed Date" {...register('completed_date')} /></Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Status" defaultValue="active" {...register('status')}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Materials Used" {...register('materials_used')} /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Challenges" {...register('challenges')} /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Testimonial" {...register('testimonial')} /></Grid>

              {/* Cover Image */}
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" display="block" mb={1}>Cover Image</Typography>
                {coverPreview && (
                  <Box mb={1} position="relative" display="inline-block">
                    <img src={coverPreview} alt="cover" style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton
                      size="small"
                      onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                      sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: '#fff', p: '2px', '&:hover': { bgcolor: 'error.dark' } }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                )}
                <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'block' }} />
              </Grid>

              {/* Gallery Images */}
              <Grid item xs={12}>
                <Typography variant="caption" display="block" mb={1}>Gallery Images</Typography>
                {existingGallery.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                    {existingGallery.map(img => (
                      <Box key={img.id} position="relative" width={80} height={80}>
                        <img src={img.image} alt="gallery" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                        <IconButton
                          size="small"
                          onClick={() => removeExistingGalleryImg(img.id)}
                          sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: '#fff', p: '2px', '&:hover': { bgcolor: 'error.dark' } }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
                <input type="file" accept="image/*" multiple onChange={e => setGalleryFiles(Array.from(e.target.files))} style={{ display: 'block' }} />
                {galleryFiles.length > 0 && (
                  <Typography variant="caption" color="text.secondary">{galleryFiles.length} new image(s) selected</Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="project-form" variant="contained" color="secondary" disabled={isPending}>
            {isPending ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

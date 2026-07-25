import {
  Box, Typography, Paper, TextField, Button, Grid, CircularProgress,
  Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAbout, updateAbout, addTeamMember, updateTeamMember, deleteTeamMember } from '../../api';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

function TeamMemberDialog({ open, onClose, member, index, qc }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef();
  const isEdit = index !== null;

  useEffect(() => {
    if (open) {
      setName(member?.name || '');
      setRole(member?.role || '');
      setImgFile(null);
      setPreview(member?.img || '');
    }
  }, [open, member]);

  const addMutation = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => { toast.success('Member added successfully!'); qc.invalidateQueries(['about']); onClose(); },
    onError: () => toast.error('Failed to add member'),
  });

  const editMutation = useMutation({
    mutationFn: ({ idx, data }) => updateTeamMember(idx, data),
    onSuccess: () => { toast.success('Member updated successfully!'); qc.invalidateQueries(['about']); onClose(); },
    onError: () => toast.error('Failed to update member'),
  });

  const handleSave = () => {
    if (!name.trim() || !role.trim()) return toast.error('Name and role are required');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('role', role);
    if (imgFile) fd.append('img', imgFile);
    if (isEdit) editMutation.mutate({ idx: index, data: fd });
    else addMutation.mutate(fd);
  };

  const isPending = addMutation.isPending || editMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Box textAlign="center">
            <Avatar
              src={preview}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 1, cursor: 'pointer', bgcolor: 'secondary.main', fontSize: 32 }}
              onClick={() => fileRef.current.click()}
            >
              {!preview && (name?.[0] || '?')}
            </Avatar>
            <Button size="small" onClick={() => fileRef.current.click()}>Upload Photo</Button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => {
              const f = e.target.files[0];
              if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)); }
            }} />
          </Box>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
          <TextField label="Role" value={role} onChange={e => setRole(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleSave} disabled={isPending}>
          {isPending ? <CircularProgress size={18} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminAbout() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['about'], queryFn: getAbout });
  const { register, handleSubmit, reset } = useForm();
  const [dialog, setDialog] = useState({ open: false, member: null, index: null });

  useEffect(() => { if (data) reset(data); }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateAbout,
    onSuccess: () => { toast.success('About page updated!'); qc.invalidateQueries(['about']); },
    onError: () => toast.error('Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => { toast.success('Member removed'); qc.invalidateQueries(['about']); },
    onError: () => toast.error('Failed to remove member'),
  });

  if (isLoading) return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;

  const team = data?.team_members || [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>About Page Management</Typography>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit(mutate)}>
          <Grid container spacing={3}>
            {[['overview', 'Overview'], ['mission', 'Mission'], ['vision', 'Vision'], ['history', 'History'], ['achievements', 'Achievements']].map(([field, label]) => (
              <Grid item xs={12} key={field}>
                <TextField fullWidth multiline rows={4} label={label} {...register(field)} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="secondary" disabled={isPending}>
                {isPending ? <CircularProgress size={20} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Team Management */}
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700}>Team Members</Typography>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setDialog({ open: true, member: null, index: null })}>
            Add Member
          </Button>
        </Box>
        <Grid container spacing={2}>
          {team.map((member, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={member.img} sx={{ width: 56, height: 56, bgcolor: 'secondary.main', fontSize: 22 }}>
                  {!member.img && member.name?.[0]}
                </Avatar>
                <Box flex={1} minWidth={0}>
                  <Typography fontWeight={600} noWrap>{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{member.role}</Typography>
                </Box>
                <IconButton size="small" onClick={() => setDialog({ open: true, member, index: i })}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(i)}><DeleteIcon fontSize="small" /></IconButton>
              </Paper>
            </Grid>
          ))}
          {team.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center" py={3}>No team members yet. Click "Add Member" to get started.</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <TeamMemberDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, member: null, index: null })}
        member={dialog.member}
        index={dialog.index}
        qc={qc}
      />
    </Box>
  );
}

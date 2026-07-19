import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Chip, CircularProgress, Avatar, Tooltip, TextField } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, blockUser } from '../../api';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { useState } from 'react';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const { mutate: remove } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries(['users']); },
  });

  const { mutate: block } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => { toast.success('User blocked'); qc.invalidateQueries(['users']); },
  });

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>User Management</Typography>
      <TextField size="small" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} sx={{ mb: 2, minWidth: 260 }} />
      <Paper>
        {isLoading ? <Box p={4} textAlign="center"><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={u.profile} sx={{ width: 32, height: 32 }}>{u.name[0]}</Avatar>
                      {u.name}
                    </Box>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Chip label={u.role} size="small" color={u.role === 'admin' ? 'primary' : 'default'} /></TableCell>
                  <TableCell><Chip label={u.is_blocked ? 'Blocked' : 'Active'} size="small" color={u.is_blocked ? 'error' : 'success'} /></TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {!u.is_blocked && <Tooltip title="Block"><IconButton size="small" color="warning" onClick={() => { if (confirm('Block user?')) block(u.id); }}><BlockIcon fontSize="small" /></IconButton></Tooltip>}
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { if (confirm('Delete user?')) remove(u.id); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} align="center">No users found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
